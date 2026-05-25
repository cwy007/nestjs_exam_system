import { PrismaService } from '@app/prisma';
import { Prisma } from '@app/prisma/generated/prisma/client';
import { RedisService } from '@app/redis';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { md5 } from './utils';

@Injectable()
export class UserService {
  getHello(): string {
    return 'Hello World!';
  }

  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  private logger = new Logger(UserService.name);

  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);

    if (!captcha) {
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST);
    }

    if (captcha !== user.captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }

    const existingUser = await this.prismaService.user.findUnique({
      where: {
        username: user.username,
      },
    });

    if (existingUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    try {
      return this.prismaService.user.create({
        data: {
          username: user.username,
          password: md5(user.password),
          email: user.email,
        },
        select: {
          id: true,
          username: true,
          email: true,
          createTime: true,
        }
      })
    } catch (error) {
      this.logger.error('注册用户失败', error);
      throw new HttpException('注册用户失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    return this.prismaService.user.findMany();
  }
}
