import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    validateUser: jest.Mock;
  };

  beforeEach(async () => {
    authService = {
      validateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('when the user tries to login', () => {
    it('should call the correct service method with the provided credentials', async () => {
      const loginDto: LoginDto = {
        username: 'test@example.com',
        password: 'password123',
      };

      await controller.login(loginDto);

      expect(authService.validateUser).toHaveBeenCalledWith({
        username: 'test@example.com',
        password: 'password123',
      });
    });

    it('should return the user with all relevant fields except for `password` inside an object', async () => {
      const loginDto: LoginDto = {
        username: 'test@example.com',
        password: 'password123',
      };
      const expectedResult = {
        id: 1,
        username: 'test@example.com',
        name: 'Test User',
        isAdmin: false,
        // no `password` field
      };
      authService.validateUser.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(result).toEqual({ user: expectedResult });
    });
  });
});
