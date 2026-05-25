import { NestFactory, Reflector } from '@nestjs/core';
import { UserModule } from './user.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import {
  CustomExceptionFilter,
  FormatResponseInterceptor,
  InvokeRecordInterceptor,
  UnLoginFilter,
} from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  // 启用 ClassSerializerInterceptor 以支持 @Exclude 和 @Expose 装饰器
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new UnLoginFilter());
  app.useGlobalFilters(new CustomExceptionFilter());

  await app.listen(process.env.port ?? 3001);
}
bootstrap();
