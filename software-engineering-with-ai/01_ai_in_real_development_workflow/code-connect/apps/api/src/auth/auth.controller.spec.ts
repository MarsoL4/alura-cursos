import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  describe('login', () => {
    it('should call authService.login and return the token', async () => {
      const dto = { email: 'john@example.com', password: 'secret123' };
      const expected = { access_token: 'signed-token' };
      authService.login.mockResolvedValue(expected);

      const result = await controller.login(dto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('getMe', () => {
    it('should return req.user', () => {
      const mockUser = {
        id: 'uuid-1',
        name: 'John',
        email: 'john@example.com',
      };
      const req = { user: mockUser };

      const result = controller.getMe(req);

      expect(result).toEqual(mockUser);
    });
  });
});
