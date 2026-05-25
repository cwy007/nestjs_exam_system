import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(process.cwd(), 'libs/prisma/src/.env')],
    }),
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule { }
