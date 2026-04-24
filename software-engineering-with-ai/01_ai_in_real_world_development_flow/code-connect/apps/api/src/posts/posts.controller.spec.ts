import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

const mockUser = { id: 'user-1', name: 'Julio', email: 'julio@test.com' };
const mockPost = {
  id: 'post-1',
  title: 'Post Teste',
  content: 'Conteúdo',
  thumbnail: null,
  tags: ['React'],
  author: mockUser,
  likesCount: 5,
  commentsCount: 2,
  likedByMe: false,
};

const mockPostsService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  addComment: jest.fn(),
  toggleLike: jest.fn(),
};

describe('PostsController', () => {
  let controller: PostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [{ provide: PostsService, useValue: mockPostsService }],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated posts', async () => {
      const paginatedResult = {
        data: [mockPost],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };
      mockPostsService.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll({ page: 1, limit: 10 }, { user: undefined });

      expect(mockPostsService.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 }, undefined);
      expect(result).toEqual(paginatedResult);
    });

    it('should pass userId from authenticated request', async () => {
      mockPostsService.findAll.mockResolvedValue({ data: [], meta: {} });

      await controller.findAll({ page: 1, limit: 10 }, { user: mockUser });

      expect(mockPostsService.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 }, mockUser.id);
    });
  });

  describe('findOne', () => {
    it('should return a single post', async () => {
      mockPostsService.findById.mockResolvedValue(mockPost);

      const result = await controller.findOne('post-1', { user: undefined });

      expect(mockPostsService.findById).toHaveBeenCalledWith('post-1', undefined);
      expect(result).toEqual(mockPost);
    });
  });

  describe('create', () => {
    it('should create a post', async () => {
      mockPostsService.create.mockResolvedValue(mockPost);

      const result = await controller.create(
        { title: 'Novo Post', content: 'Conteúdo' },
        { user: mockUser },
      );

      expect(mockPostsService.create).toHaveBeenCalledWith(
        { title: 'Novo Post', content: 'Conteúdo' },
        mockUser.id,
      );
      expect(result).toEqual(mockPost);
    });
  });

  describe('addComment', () => {
    it('should add a comment to a post', async () => {
      const mockComment = { id: 'c-1', content: 'Ótimo!', author: mockUser };
      mockPostsService.addComment.mockResolvedValue(mockComment);

      const result = await controller.addComment('post-1', { content: 'Ótimo!' }, { user: mockUser });

      expect(mockPostsService.addComment).toHaveBeenCalledWith('post-1', { content: 'Ótimo!' }, mockUser.id);
      expect(result).toEqual(mockComment);
    });
  });

  describe('toggleLike', () => {
    it('should toggle like on a post', async () => {
      mockPostsService.toggleLike.mockResolvedValue({ liked: true });

      const result = await controller.toggleLike('post-1', { user: mockUser });

      expect(mockPostsService.toggleLike).toHaveBeenCalledWith('post-1', mockUser.id);
      expect(result).toEqual({ liked: true });
    });
  });
});
