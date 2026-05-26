import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { AnalyseService } from './analyse.service';
import { RequireLogin } from '@app/common';

@Controller('analyse')
export class AnalyseController {
  constructor(private readonly analyseService: AnalyseService) { }

  @Get()
  getHello(): string {
    return this.analyseService.getHello();
  }

  @RequireLogin()
  @Get('ranking')
  getRanking(@Query('examId') examId: number) {
    if (!examId) {
      throw new BadRequestException('examId is required');
    }
    return this.analyseService.getRanking(examId);
  }
}
