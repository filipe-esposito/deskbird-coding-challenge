import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../features/user/entities/user.entity';
import { SeedService } from './seed.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), DatabaseModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
