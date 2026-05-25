import { NestFactory, Reflector } from '@nestjs/core';
import { ExamModule } from './exam.module';
import { Transport } from '@nestjs/microservices';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import {
  CustomExceptionFilter,
  FormatResponseInterceptor,
  InvokeRecordInterceptor,
  UnLoginFilter,
} from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(ExamModule);

  app.enableCors();

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 8888,
    },
  });
  await app.startAllMicroservices();

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  // 启用 ClassSerializerInterceptor 以支持 @Exclude 和 @Expose 装饰器
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new UnLoginFilter());
  app.useGlobalFilters(new CustomExceptionFilter());

  await app.listen(process.env.port ?? 3002);
}
bootstrap();
