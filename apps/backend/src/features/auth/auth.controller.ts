import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { instanceToPlain } from 'class-transformer';
import { UserResponseDto } from '../user/dto/user-response.dto';

@Controller('login')
export class AuthController {
  constructor(private readonly loginService: AuthService) {}

  @Post()
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    const userFound = await this.loginService.validateUser(loginDto);
    const userResponse = instanceToPlain(
      new UserResponseDto(userFound)
    ) as Partial<UserResponseDto>;

    return {
      user: userResponse,
    };
  }
}
