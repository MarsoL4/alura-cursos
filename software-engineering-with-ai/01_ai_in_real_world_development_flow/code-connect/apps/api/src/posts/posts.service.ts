import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
  ) {}

  async findAll(query: QueryPostsDto, userId?: string) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const qb = this.postsRepository
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .addSelect(['author.id', 'author.name', 'author.email'])
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments')
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (query.search) {
      qb.where(
        'post.title ILIKE :search OR post.content ILIKE :search',
        { search: `%${query.search}%` },
      );
    }

    const [posts, total] = await qb.getManyAndCount();

    let likedPostIds: Set<string> = new Set();
    if (userId) {
      const likes = await this.likesRepository
        .createQueryBuilder('like')
        .innerJoin('like.post', 'post')
        .where('like.userId = :userId', { userId })
        .select('post.id')
        .getRawMany();
      likedPostIds = new Set(likes.map((l) => l.post_id));
    }

    const data = posts.map((post) => ({
      ...post,
      likedByMe: likedPostIds.has(post.id),
    }));

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string, userId?: string) {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .addSelect(['author.id', 'author.name', 'author.email'])
      .leftJoinAndSelect('post.comments', 'comment')
      .leftJoin('comment.author', 'commentAuthor')
      .addSelect(['commentAuthor.id', 'commentAuthor.name'])
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .where('post.id = :id', { id })
      .getOne();

    if (!post) throw new NotFoundException('Post não encontrado');

    let likedByMe = false;
    if (userId) {
      const like = await this.likesRepository.findOne({
        where: { user: { id: userId }, post: { id } },
      });
      likedByMe = !!like;
    }

    return { ...post, likedByMe };
  }

  async create(dto: CreatePostDto, authorId: string) {
    const post = this.postsRepository.create({
      ...dto,
      author: { id: authorId },
    });
    return this.postsRepository.save(post);
  }

  async addComment(postId: string, dto: CreateCommentDto, authorId: string) {
    const post = await this.postsRepository.findOneBy({ id: postId });
    if (!post) throw new NotFoundException('Post não encontrado');

    const comment = this.commentsRepository.create({
      content: dto.content,
      author: { id: authorId },
      post: { id: postId },
    });
    return this.commentsRepository.save(comment);
  }

  async toggleLike(postId: string, userId: string) {
    const post = await this.postsRepository.findOneBy({ id: postId });
    if (!post) throw new NotFoundException('Post não encontrado');

    const existing = await this.likesRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    if (existing) {
      await this.likesRepository.remove(existing);
      return { liked: false };
    }

    const like = this.likesRepository.create({
      user: { id: userId },
      post: { id: postId },
    });
    await this.likesRepository.save(like);
    return { liked: true };
  }
}
