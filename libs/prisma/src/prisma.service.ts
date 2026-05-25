import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from './generated/prisma/client';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly configService: ConfigService) {
    const adapter = new PrismaMariaDb(configService.get<string>('DATABASE_URL') as string);
    super({
      adapter,
      log: [
        {
          emit: 'stdout',
          level: 'query',
        }
      ]
    })
  }
}
