import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  describe('login', () => {
    it('should return access_token on valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('secret123', 10);
      usersService.findByEmail.mockResolvedValue({
        id: 'uuid-1',
        name: 'John',
        email: 'john@example.com',
        password: hashedPassword,
      });
      jwtService.sign.mockReturnValue('signed-token');

      const result = await service.login({
        email: 'john@example.com',
        password: 'secret123',
      });

      expect(result).toEqual({ access_token: 'signed-token' });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'uuid-1',
        email: 'john@example.com',
      });
    });

    it('should throw UnauthorizedException when email not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nobody@example.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is wrong', async () => {
      const hashedPassword = await bcrypt.hash('correct-pass', 10);
      usersService.findByEmail.mockResolvedValue({
        id: 'uuid-1',
        name: 'John',
        email: 'john@example.com',
        password: hashedPassword,
      });

      await expect(
        service.login({ email: 'john@example.com', password: 'wrong-pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
