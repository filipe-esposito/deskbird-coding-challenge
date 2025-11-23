import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../features/user/entities/user.entity';
import { encryptPassword } from '../utils/password-encryption';

jest.mock('../utils/password-encryption');

describe('SeedService', () => {
  let service: SeedService;
  let userRepository: {
    clear: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(async () => {
    userRepository = {
      clear: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        { provide: getRepositoryToken(User), useValue: userRepository },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
  });

  describe('when seeding the database', () => {
    it('should empty the user repository', async () => {
      await service.run();

      expect(userRepository.clear).toHaveBeenCalled();
    });

    it('should create one admin user with specific properties', async () => {
      (encryptPassword as jest.Mock).mockResolvedValue('hashedPassword');

      await service.run();

      const expectedAdminUser: User = {
        id: 1,
        name: 'Test Admin',
        username: 'test_admin',
        password: await encryptPassword('admin123'),
        isAdmin: true,
      };
      expect(encryptPassword).toHaveBeenCalledWith('admin123');
      expect(userRepository.save).toHaveBeenCalledWith(expectedAdminUser);
    });
  });
});
