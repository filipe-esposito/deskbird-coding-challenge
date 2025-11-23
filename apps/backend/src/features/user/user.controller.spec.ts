import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    userService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userService }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe('create', () => {
    it('should call the correct service method with the provided DTO and return the created user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        username: 'test@example.com',
        password: 'password123',
        isAdmin: 'false' as any,
      };
      const expectedResult = {
        id: 1,
        name: 'Test User',
        username: 'test@example.com',
        isAdmin: false,
      };
      userService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createUserDto);

      expect(userService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call the correct service method and return all users', async () => {
      const expectedResult = [
        { id: 1, name: 'Alice', username: 'alice@example.com', isAdmin: false },
        { id: 2, name: 'Bob', username: 'bob@example.com', isAdmin: true },
      ];
      userService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(userService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call the correct service method with the provided id and return the user', async () => {
      const userId = 1;
      const expectedResult = {
        id: userId,
        name: 'Alice',
        username: 'alice@example.com',
        isAdmin: false,
      };
      userService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(userId.toString());

      expect(userService.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call the correct service method with the provided id and DTO and return the updated user', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
        username: 'updated@example.com',
        password: 'newPassword',
        isAdmin: 'true' as any,
      };
      const expectedResult = {
        id: userId,
        name: 'Updated User',
        username: 'updated@example.com',
        isAdmin: true,
      };
      userService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(userId.toString(), updateUserDto);

      expect(userService.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should call the correct service method with the provided id', async () => {
      const userId = 1;
      userService.remove.mockResolvedValue(undefined);

      await controller.remove(userId.toString());

      expect(userService.remove).toHaveBeenCalledWith(userId);
    });
  });
});
