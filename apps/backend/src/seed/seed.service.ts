import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../features/user/entities/user.entity';

// TODO remove duplication with user.service.ts
const BCRYPT_SALT_ROUNDS = 12;

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
      password: await this.encryptPassword('admin123'),
      isAdmin: true,
    };
    await this.userRepository.save(baseAdminUser);
  }

  // TODO remove duplication with user.service.ts
  private async encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }
}
