import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: {
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    userRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('when validating the credentials provided', () => {
    it('should return a user when credentials are valid', async () => {
      const mockUser = {
        id: 1,
        username: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        isAdmin: false,
      };
      userRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser({
        username: 'test@example.com',
        password: 'plainPassword',
      });

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'test@example.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'plainPassword',
        'hashedPassword'
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('should throw `UnauthorizedException`', () => {
    it('when the `username` provided does not belong to any existing user', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.validateUser({
          username: 'nonexistent@example.com',
          password: 'password',
        })
      ).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'nonexistent@example.com' },
      });
    });

    it('when the `username` provided does belong to an existing user, but the `password` provided does not', async () => {
      const mockUser = {
        id: 1,
        username: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        isAdmin: false,
      };
      userRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser({
          username: 'test@example.com',
          password: 'wrongPassword',
        })
      ).rejects.toThrow(UnauthorizedException);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongPassword',
        'hashedPassword'
      );
    });
  });
});
