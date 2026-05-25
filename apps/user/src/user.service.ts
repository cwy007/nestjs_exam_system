import { PrismaService } from '@app/prisma';
import { Prisma } from '@app/prisma/generated/prisma/client';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getHello(): string {
    return 'Hello World!';
  }

  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  async create(data: Prisma.UserCreateInput) {
    return this.prismaService.user.create({
      data,
      select: {
        id: true,
      }
    })
  }

  async findAll() {
    return this.prismaService.user.findMany();
  }
}
