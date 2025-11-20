import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { encryptPassword } from '../../utils/password-encryption';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(
    createUserDto: CreateUserDto
  ): Promise<Partial<UserResponseDto>> {
    const user = new User();

    user.name = createUserDto.name;
    user.username = createUserDto.username;
    user.isAdmin = this.transformStringToBoolean(createUserDto.isAdmin);

    user.password = await encryptPassword(createUserDto.password);

    const savedUser = await this.userRepository.save(user);

    return instanceToPlain(
      new UserResponseDto(savedUser)
    ) as Partial<UserResponseDto>;
  }

  async findAll(): Promise<Partial<UserResponseDto>[]> {
    const users = (await this.userRepository.find()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return instanceToPlain(
      users.map((user) => new UserResponseDto(user))
    ) as Partial<UserResponseDto>[];
  }

  async findOne(id: number): Promise<Partial<UserResponseDto>> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return instanceToPlain(
      new UserResponseDto(user)
    ) as Partial<UserResponseDto>;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto
  ): Promise<Partial<UserResponseDto>> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userUpdate: Partial<User> = { id };

    if (updateUserDto.name) {
      userUpdate.name = updateUserDto.name;
    }

    if (updateUserDto.username) {
      userUpdate.username = updateUserDto.username;
    }

    if (updateUserDto.password) {
      userUpdate.password = await encryptPassword(updateUserDto.password);
    }

    if (updateUserDto.isAdmin !== undefined) {
      userUpdate.isAdmin = this.transformStringToBoolean(updateUserDto.isAdmin);
    }

    await this.userRepository.update({ id }, userUpdate);

    return instanceToPlain(
      new UserResponseDto(userUpdate)
    ) as Partial<UserResponseDto>;
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  private transformStringToBoolean(value: string | boolean): boolean {
    if (typeof value === 'boolean') return value;

    if (value === 'true') return true;

    return false;
  }
}
