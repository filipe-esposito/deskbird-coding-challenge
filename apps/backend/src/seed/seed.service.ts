import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../features/user/entities/user.entity';
import { encryptPassword } from '../utils/password-encryption';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async run() {
    await this.userRepository.clear();

    const baseAdminUser: User = {
      id: 1,
      name: 'Test Admin',
      username: 'test_admin',
      password: await encryptPassword('admin123'),
      isAdmin: true,
    };

    await this.userRepository.save(baseAdminUser);
  }
}
