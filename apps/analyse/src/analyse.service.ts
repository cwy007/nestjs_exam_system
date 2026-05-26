import { PrismaService } from '@app/prisma';
import { RedisService } from '@app/redis';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AnalyseService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  getHello(): string {
    return 'Hello World!';
  }

  async getRanking(examId: number) {
    const answers = await this.prismaService.answer.findMany({
      where: {
        examId,
      },
    });
    if (answers.length === 0) {
      return [];
    }
    await this.redisService.zAdd(
      `ranking:${examId}`,
      Object.fromEntries(answers.map((a) => [a.id, a.score])),
    );
    const answerIds = await this.redisService.zRangeList(`ranking:${examId}`, 0, 9);
    const res: any[] = [];
    for (let i = 0; i < answerIds.length; i++) {
      const answer = await this.prismaService.answer.findUnique({
        where: {
          id: +answerIds[i]
        },
        include: {
          answerer: true,
          exam: true
        }
      })
      res.push(answer);
    }
    return res;
  }
}
