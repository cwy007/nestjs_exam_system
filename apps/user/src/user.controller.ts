import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RedisService } from '@app/redis';
import { Prisma } from '@app/prisma/generated/prisma/client';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Get()
  async getHello(): Promise<string> {
    const keys = await this.redisService.keys('*');
    return this.userService.getHello() + keys;
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    delete registerUserDto.captcha;
    return this.userService.create(registerUserDto);
  }
}
