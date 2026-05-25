import { PrismaService } from '@app/prisma';
import { Inject, Injectable } from '@nestjs/common';
import { AddExamDto } from './dto/add-exam.dto';
import { SaveExamDto } from './dto/save-exam.dto';

@Injectable()
export class ExamService {
  getHello(): string {
    return 'Hello World!';
  }

  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  async add(dto: AddExamDto, userId: number) {
    const exam = await this.prismaService.exam.create({
      data: {
        name: dto.name,
        content: '',
        createUserId: userId,
      },
    });
    return exam;
  }

  async list(userId: number, bin: string, page: number, pageSize: number) {
    const [list, total] = await Promise.all([
      this.prismaService.exam.findMany({
        where: {
          isDeleted: bin !== undefined,
          createUserId: userId,
        },
        orderBy: {
          id: 'desc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prismaService.exam.count({
        where: {
          isDeleted: bin !== undefined,
          createUserId: userId,
        },
      })
    ]);

    return {
      list,
      total,
    };
  }

  async delete(userId: number, id: number) {
    return this.prismaService.exam.update({
      where: {
        id,
        createUserId: userId,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  async save(dto: SaveExamDto) {
    return this.prismaService.exam.update({
      where: {
        id: dto.id,
      },
      data: {
        content: dto.content,
      },
    });
  }

  async publish(id: number) {
    return this.prismaService.exam.update({
      where: {
        id,
      },
      data: {
        isPublished: true,
      },
    });
  }

  async unpublish(id: number) {
    return this.prismaService.exam.update({
      where: {
        id,
      },
      data: {
        isPublished: false,
      },
    });
  }

  async getExam(id: number) {
    return this.prismaService.exam.findUnique({
      where: {
        id,
      },
    });
  }
}
