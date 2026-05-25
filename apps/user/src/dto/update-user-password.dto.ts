import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class UpdateUserPasswordDto {
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码必须至少6个字符' })
  password: string;

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @IsNotEmpty({ message: '验证码不能为空' })
  captcha: string;
}
