import { PartialType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

export class UserResponseDto extends PartialType(CreateUserDto) {
  id!: number;

  @Exclude()
  override password!: string;

  constructor(partial: Partial<UserResponseDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
