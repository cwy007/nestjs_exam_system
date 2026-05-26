import { Inject, Injectable } from '@nestjs/common';
import { AddAnswerDto } from './dto/add-answer.dto';
import { PrismaService } from '@app/prisma';
import { ExcelService } from '@app/excel';

@Injectable()
export class AnswerService {

  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(ExcelService)
  private readonly excelService: ExcelService;

  getHello(): string {
    return 'Hello World!';
  }

  async add(addAnswerDto: AddAnswerDto, userId: number) {
    const exam = await this.prismaService.exam.findUnique({
      where: {
        id: addAnswerDto.examId,
      },
    });
    const questions = exam?.content ? JSON.parse(exam.content) : [];
    const answers = addAnswerDto.content ? JSON.parse(addAnswerDto.content) : [];

    // 把用户答案按题目 id 建索引，避免顺序不一致导致匹配错误
    const answerMap = new Map<string, any>(
      answers.map((a: { id: string; answer: any }) => [a.id, a.answer]),
    );

    const isAnswerEqual = (correct: any, user: any) => {
      if (Array.isArray(correct)) {
        if (!Array.isArray(user)) return false;
        if (correct.length !== user.length) return false;
        const sortedCorrect = [...correct].map(String).sort();
        const sortedUser = [...user].map(String).sort();
        return sortedCorrect.every((v, i) => v === sortedUser[i]);
      }
      return correct === user;
    };

    let score = 0;
    for (const q of questions) {
      const userAnswer = answerMap.get(q.id);
      if (userAnswer === undefined) continue;
      if (isAnswerEqual(q.answer, userAnswer)) {
        score += Number(q.score) || 0;
      }
    }
    return this.prismaService.answer.create({
      data: {
        content: addAnswerDto.content,
        score: score,
        answerer: {
          connect: {
            id: userId,
          },
        },
        exam: {
          connect: {
            id: addAnswerDto.examId,
          }
        }
      },
    });
  }

  async list(examId: number, page: number, pageSize: number) {
    const [list, total] = await Promise.all([
      this.prismaService.answer.findMany({
        where: {
          examId: examId,
        },
        orderBy: {
          id: 'asc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prismaService.answer.count({
        where: {
          examId: examId,
        },
      })
    ]);

    return {
      list,
      total,
    };
  }

  async getAnswerById(id: number) {
    return this.prismaService.answer.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        content: true,
        score: true,
        createTime: true,
        updateTime: true,
        answererId: true,
        examId: true,
        exam: true,
        answerer: true,
      }
    });
  }

  async export(examId: number) {
    const list = await this.prismaService.answer.findMany({
      where: {
        examId: examId,
      },
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        content: true,
        score: true,
        createTime: true,
        updateTime: true,
        answererId: true,
        examId: true,
        exam: {
          select: {
            name: true,
          }
        },
        answerer: {
          select: {
            username: true,
          }
        },
      }
    });

    // 添加表头
    const columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: '内容', key: 'content', width: 30 },
      { header: '分数', key: 'score', width: 10 },
      { header: '创建时间', key: 'createTime', width: 20 },
      { header: '更新时间', key: 'updateTime', width: 20 },
      { header: '答题人ID', key: 'answererId', width: 15 },
      { header: '考试ID', key: 'examId', width: 15 },
      { header: '考试名称', key: 'examName', width: 30 },
      { header: '答题人姓名', key: 'answererName', width: 30 },
    ];

    // 添加数据行
    const data = list.map(item => ({
      id: item.id,
      content: item.content,
      score: item.score,
      createTime: item.createTime.toISOString(),
      updateTime: item.updateTime.toISOString(),
      answererId: item.answererId,
      examId: item.examId,
      examName: item.exam?.name,
      answererName: item.answerer?.username,
    }));

    return this.excelService.export(columns, data, 'answers.xlsx');
  }

}
