import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';

const mockAuthor = { id: 'user-1', name: 'Julio Silva', email: 'julio@test.com' };

const mockPost: Partial<Post> = {
  id: 'post-1',
  title: 'Post de Teste',
  content: 'Conteúdo do post de teste para verificar o serviço.',
  thumbnail: 'https://example.com/img.png',
  tags: ['React', 'TypeScript'],
  author: mockAuthor as any,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockComment = {
  id: 'comment-1',
  content: 'Ótimo post!',
  author: { id: 'user-2', name: 'Ana' },
  post: { id: 'post-1' },
  createdAt: new Date(),
};

const mockLike = {
  id: 'like-1',
  user: { id: 'user-2' },
  post: { id: 'post-1' },
  createdAt: new Date(),
};

const createQueryBuilderMock = (result: any) => ({
  leftJoin: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  loadRelationCountAndMap: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  innerJoin: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  getOne: jest.fn().mockResolvedValue(result),
  getManyAndCount: jest.fn().mockResolvedValue([[result], 1]),
  getRawMany: jest.fn().mockResolvedValue([]),
});

describe('PostsService', () => {
  let service: PostsService;
  let postRepo: any;
  let commentRepo: any;
  let likeRepo: any;

  beforeEach(async () => {
    postRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(createQueryBuilderMock(mockPost)),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    commentRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    likeRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(createQueryBuilderMock(null)),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: postRepo },
        { provide: getRepositoryToken(Comment), useValue: commentRepo },
        { provide: getRepositoryToken(Like), useValue: likeRepo },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  describe('findAll', () => {
    it('should return paginated posts', async () => {
      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
    });

    it('should apply search filter when provided', async () => {
      const qbMock = createQueryBuilderMock(mockPost);
      postRepo.createQueryBuilder.mockReturnValue(qbMock);

      await service.findAll({ page: 1, limit: 10, search: 'React' });

      expect(qbMock.where).toHaveBeenCalledWith(
        'post.title ILIKE :search OR post.content ILIKE :search',
        { search: '%React%' },
      );
    });

    it('should include likedByMe false when no userId provided', async () => {
      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data[0]).toHaveProperty('likedByMe', false);
    });
  });

  describe('findById', () => {
    it('should return a post by id', async () => {
      const result = await service.findById('post-1');
      expect(result).toHaveProperty('id', 'post-1');
    });

    it('should throw NotFoundException when post not found', async () => {
      const qbMock = createQueryBuilderMock(null);
      postRepo.createQueryBuilder.mockReturnValue(qbMock);

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should include likedByMe true when user liked the post', async () => {
      likeRepo.findOne.mockResolvedValue(mockLike);

      const result = await service.findById('post-1', 'user-2');
      expect(result.likedByMe).toBe(true);
    });
  });

  describe('create', () => {
    it('should create and return a post', async () => {
      postRepo.create.mockReturnValue(mockPost);
      postRepo.save.mockResolvedValue(mockPost);

      const result = await service.create(
        { title: 'Novo Post', content: 'Conteúdo', tags: ['React'] },
        'user-1',
      );

      expect(postRepo.create).toHaveBeenCalled();
      expect(postRepo.save).toHaveBeenCalled();
      expect(result).toEqual(mockPost);
    });
  });

  describe('addComment', () => {
    it('should add a comment to a post', async () => {
      postRepo.findOneBy.mockResolvedValue(mockPost);
      commentRepo.create.mockReturnValue(mockComment);
      commentRepo.save.mockResolvedValue(mockComment);

      const result = await service.addComment('post-1', { content: 'Ótimo!' }, 'user-2');

      expect(commentRepo.save).toHaveBeenCalled();
      expect(result).toEqual(mockComment);
    });

    it('should throw NotFoundException when post not found', async () => {
      postRepo.findOneBy.mockResolvedValue(null);

      await expect(
        service.addComment('nonexistent', { content: 'Test' }, 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleLike', () => {
    it('should create like when not already liked', async () => {
      postRepo.findOneBy.mockResolvedValue(mockPost);
      likeRepo.findOne.mockResolvedValue(null);
      likeRepo.create.mockReturnValue(mockLike);
      likeRepo.save.mockResolvedValue(mockLike);

      const result = await service.toggleLike('post-1', 'user-2');
      expect(result).toEqual({ liked: true });
    });

    it('should remove like when already liked', async () => {
      postRepo.findOneBy.mockResolvedValue(mockPost);
      likeRepo.findOne.mockResolvedValue(mockLike);

      const result = await service.toggleLike('post-1', 'user-2');
      expect(likeRepo.remove).toHaveBeenCalledWith(mockLike);
      expect(result).toEqual({ liked: false });
    });

    it('should throw NotFoundException when post not found', async () => {
      postRepo.findOneBy.mockResolvedValue(null);

      await expect(service.toggleLike('nonexistent', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });
});
