import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RedisService } from '@app/redis';
import { Prisma } from '@app/prisma/generated/prisma/client';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from '@app/email/email.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(EmailService)
  private readonly emailService: EmailService;

  @Get()
  async getHello(): Promise<string> {
    const keys = await this.redisService.keys('*');
    return this.userService.getHello() + keys;
  }

  @Get('register-captcha')
  async getRegisterCaptcha(@Query('email') email: string) {
    const captcha = Math.random().toString(36).substring(2, 8);
    await this.redisService.set(`captcha_${email}`, captcha, 5 * 60);
    console.log(`验证码已发送到${email}，验证码为${captcha}`);
    await this.emailService.sendMail({
      to: email,
      subject: '注册验证码',
      html: `<p>您的注册验证码是：<b>${captcha}</b>，有效期5分钟</p>`,
    });
    return "验证码已发送";
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }
}
