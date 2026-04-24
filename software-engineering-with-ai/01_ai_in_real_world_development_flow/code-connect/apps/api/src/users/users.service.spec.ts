import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const mockUser: User = {
  id: 'uuid-1',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashed-password',
};

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Pick<Repository<User>, 'findOneBy' | 'create' | 'save'>>;

  beforeEach(async () => {
    repo = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a user and return it without password', async () => {
      repo.findOneBy.mockResolvedValue(null);
      repo.create.mockReturnValue(mockUser);
      repo.save.mockResolvedValue(mockUser);

      const result = await service.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'secret123',
      });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', 'John Doe');
      expect(result).toHaveProperty('email', 'john@example.com');
      expect(result).not.toHaveProperty('password');
    });

    it('should hash the password before saving', async () => {
      repo.findOneBy.mockResolvedValue(null);
      repo.create.mockImplementation((data) => data as User);
      repo.save.mockImplementation(async (data) => ({ ...data, id: 'uuid-1' }) as User);

      await service.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'secret123',
      });

      const savedData = repo.save.mock.calls[0][0] as User;
      const isMatch = await bcrypt.compare('secret123', savedData.password);
      expect(isMatch).toBe(true);
    });

    it('should generate unique IDs for each user', async () => {
      repo.findOneBy.mockResolvedValue(null);
      repo.create.mockImplementation((data) => data as User);
      repo.save
        .mockResolvedValueOnce({ ...mockUser, id: 'uuid-1', email: 'alice@example.com' })
        .mockResolvedValueOnce({ ...mockUser, id: 'uuid-2', email: 'bob@example.com' });

      const u1 = await service.create({ name: 'Alice', email: 'alice@example.com', password: 'pass123' });
      const u2 = await service.create({ name: 'Bob', email: 'bob@example.com', password: 'pass456' });

      expect(u1.id).not.toEqual(u2.id);
    });

    it('should throw ConflictException for duplicate email', async () => {
      repo.findOneBy.mockResolvedValue(mockUser);

      await expect(
        service.create({
          name: 'John Clone',
          email: 'john@example.com',
          password: 'other123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      repo.findOneBy.mockResolvedValue(mockUser);

      const user = await service.findByEmail('john@example.com');
      expect(user).toBeDefined();
      expect(user?.email).toBe('john@example.com');
    });

    it('should return null when not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      const user = await service.findByEmail('nobody@example.com');
      expect(user).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      repo.findOneBy.mockResolvedValue(mockUser);

      const user = await service.findById('uuid-1');
      expect(user).toBeDefined();
      expect(user?.id).toBe('uuid-1');
    });

    it('should return null when not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      const user = await service.findById('non-existent-id');
      expect(user).toBeNull();
    });
  });
});
