import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  describe('create', () => {
    it('should call usersService.create and return the result', async () => {
      const dto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'secret123',
      };
      const expected = {
        id: 'uuid-1',
        name: 'John Doe',
        email: 'john@example.com',
      };
      usersService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });
});
