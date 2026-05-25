import { Body, Controller, DefaultValuePipe, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AddAnswerDto } from './dto/add-answer.dto';
import { generateParseIntPipe, RequireLogin, UserInfo } from '@app/common';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) { }

  @Inject('EXAM_SERVICE')
  private readonly examClient: ClientProxy;

  @Get()
  async getHello(): Promise<string> {
    const pattern = 'sum';
    const data = [1, 2, 3, 4, 5];
    const value = await firstValueFrom(this.examClient.send<number>(pattern, data));
    return this.answerService.getHello() + value;
  }

  @RequireLogin()
  @Post('add')
  async add(@Body() addAnswerDto: AddAnswerDto, @UserInfo('userId') userId: number) {
    console.log(addAnswerDto, userId);
    return this.answerService.add(addAnswerDto, userId);
  }

  @RequireLogin()
  @Get('list')
  async list(
    @Query('examId', generateParseIntPipe('examId')) examId: number,
    @Query('page', new DefaultValuePipe(1), generateParseIntPipe('page'))
    page: number,
    @Query('pageSize', new DefaultValuePipe(10), generateParseIntPipe('pageSize'))
    pageSize: number,
  ) {
    return this.answerService.list(examId, page, pageSize);
  }

  @RequireLogin()
  @Get('export')
  async export(@Query('examId', generateParseIntPipe('examId')) examId: number) {
    console.log('examId', examId);
    return this.answerService.export(+examId)
  }

  @RequireLogin()
  @Get(':id')
  async getAnswerById(@Param('id') id: number) {
    return this.answerService.getAnswerById(id);
  }
}
