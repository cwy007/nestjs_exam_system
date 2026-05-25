import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Query } from '@nestjs/common';
import { ExamService } from './exam.service';
import { MessagePattern } from '@nestjs/microservices';
import { RedisService } from '@app/redis';
import { AddExamDto } from './dto/add-exam.dto';
import { RequireLogin, UserInfo } from '@app/common';
import { SaveExamDto } from './dto/save-exam.dto';
import { generateParseIntPipe } from '@app/common/common.pipe';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) { }

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Get()
  async getHello(): Promise<string> {
    const keys = await this.redisService.keys('*');
    return this.examService.getHello() + keys;
  }

  @MessagePattern('sum')
  async accumulate(data: number[]): Promise<number> {
    return (data || []).reduce((a, b) => a + b);
  }

  @RequireLogin()
  @Post('add')
  @HttpCode(HttpStatus.OK)
  async add(@Body() addExamDto: AddExamDto, @UserInfo('userId') userId: number) {
    console.log(addExamDto);
    console.log('userId', userId);
    return this.examService.add(addExamDto, userId);
  }

  @RequireLogin()
  @Get('list')
  async list(
    @UserInfo('userId') userId: number,
    @Query('bin') bin: string,
    @Query('page', new DefaultValuePipe(1), generateParseIntPipe('page'))
    page: number,
    @Query('pageSize', new DefaultValuePipe(10), generateParseIntPipe('pageSize'))
    pageSize: number,
  ) {
    return this.examService.list(userId, bin, page, pageSize);
  }

  @RequireLogin()
  @Delete('delete/:id')
  async delete(@UserInfo('userId') userId: number, @Param('id') id: number) {
    return this.examService.delete(userId, id);
  }

  @RequireLogin()
  @Post('save')
  @HttpCode(HttpStatus.OK)
  async save(@Body() saveExamDto: SaveExamDto) {
    return this.examService.save(saveExamDto);
  }

  @RequireLogin()
  @Get('publish/:id')
  async publish(@Param('id') id: number) {
    return this.examService.publish(id);
  }

  @RequireLogin()
  @Get('unpublish/:id')
  async unpublish(@Param('id') id: number) {
    return this.examService.unpublish(id);
  }

  @RequireLogin()
  @Get(':id')
  async getExam(@Param('id') id: number) {
    return this.examService.getExam(id);
  }
}
