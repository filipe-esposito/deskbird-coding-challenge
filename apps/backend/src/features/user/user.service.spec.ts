import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { encryptPassword } from '../../utils/password-encryption';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

jest.mock('../../utils/password-encryption', () => ({
  encryptPassword: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let userRepository: {
    save: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    userRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: userRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('when creating a user', () => {
    it('should call the correct repository method with correct parameters (including `isAdmin` as boolean and an encrypted password)', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        username: 'test@example.com',
        password: 'plainPassword',
        isAdmin: 'true' as any, // simulating string input
      };
      const encrypted = 'encryptedPassword';
      (encryptPassword as jest.Mock).mockResolvedValue(encrypted);
      userRepository.save.mockResolvedValue({
        ...createUserDto,

        password: encrypted,
        isAdmin: true,
        id: 1,
      });

      await service.create(createUserDto);

      expect(encryptPassword).toHaveBeenCalledWith('plainPassword');
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test User',
          username: 'test@example.com',
          password: encrypted,
          isAdmin: true,
        })
      );
    });

    it('should return the newly create user with a new `id` and without the `password` field', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        username: 'test@example.com',
        password: 'plainPassword',
        isAdmin: 'false' as any, // simulating string input
      };
      (encryptPassword as jest.Mock).mockResolvedValue('encryptedPassword');
      userRepository.save.mockResolvedValue({
        ...createUserDto,

        password: 'encryptedPassword',
        isAdmin: false,
        id: 2,
      });

      const result = await service.create(createUserDto);

      expect(result).not.toHaveProperty('password');
    });
  });

  describe('when finding all users', () => {
    it('should return users sorted by name ascending', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'Charlie',
          username: 'charlie@example.com',
          password: 'hash1',
          isAdmin: false,
        },
        {
          id: 2,
          name: 'Alice',
          username: 'alice@example.com',
          password: 'hash2',
          isAdmin: true,
        },
        {
          id: 3,
          name: 'Bob',
          username: 'bob@example.com',
          password: 'hash3',
          isAdmin: false,
        },
      ];
      userRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Bob');
      expect(result[2].name).toBe('Charlie');
    });

    it('should return all user objects without the password field', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'Alice',
          username: 'alice@example.com',
          password: 'hash1',
          isAdmin: false,
        },
        {
          id: 2,
          name: 'Bob',
          username: 'bob@example.com',
          password: 'hash2',
          isAdmin: true,
        },
      ];
      userRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      result.forEach((user) => {
        expect(user).not.toHaveProperty('password');
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('isAdmin');
      });
    });
  });

  describe('when finding a single user', () => {
    it('should return the user containing all fields except for the `password` field', async () => {
      const mockUser = {
        id: 1,
        name: 'Alice',
        username: 'alice@example.com',
        password: 'hash1',
        isAdmin: false,
      };
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('username');
      expect(result).toHaveProperty('isAdmin');
    });

    it('should throw `NotFoundException` if the user with the provided id is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('when updating a user', () => {
    it('should call the correct repository method with correct parameters (including `isAdmin` as boolean and an encrypted password)', async () => {
      const existingUser = {
        id: 1,
        name: 'Old Name',
        username: 'old@example.com',
        password: 'oldHash',
        isAdmin: false,
      };
      userRepository.findOne.mockResolvedValue(existingUser);
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
        username: 'updated@example.com',
        password: 'newPassword',
        isAdmin: 'true' as any,
      };
      const encrypted = 'encryptedNewPassword';
      (encryptPassword as jest.Mock).mockResolvedValue(encrypted);

      await service.update(1, updateUserDto);

      expect(encryptPassword).toHaveBeenCalledWith('newPassword');
      expect(userRepository.update).toHaveBeenCalledWith(
        { id: 1 },
        {
          id: 1,
          name: 'Updated User',
          username: 'updated@example.com',
          password: encrypted,
          isAdmin: true,
        }
      );
    });

    it('should return the updated user containing all fields except for the `password` field', async () => {
      const existingUser = {
        id: 1,
        name: 'Old Name',
        username: 'old@example.com',
        password: 'oldHash',
        isAdmin: true,
      };
      userRepository.findOne.mockResolvedValueOnce(existingUser);
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
        username: 'updated@example.com',
        password: 'newPassword',
        isAdmin: 'false' as any,
      };
      (encryptPassword as jest.Mock).mockResolvedValue('encryptedNewPassword');

      const result = await service.update(1, updateUserDto);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('username');
      expect(result).toHaveProperty('isAdmin');
    });

    it('should throw `NotFoundException` if the user with the provided id is not found', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
        username: 'updated@example.com',
        password: 'newPassword',
        isAdmin: 'true' as any,
      };
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateUserDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('when removing a user', () => {
    it('should call the correct repository method with the user id as a parameter', async () => {
      await service.remove(1);

      expect(userRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
