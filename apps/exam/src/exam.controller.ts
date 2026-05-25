import { Controller, Get } from '@nestjs/common';
import { ExamService } from './exam.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ExamController {
  constructor(private readonly examService: ExamService) { }

  @Get()
  getHello(): string {
    return this.examService.getHello();
  }

  @MessagePattern('sum')
  async accumulate(data: number[]): Promise<number> {
    return (data || []).reduce((a, b) => a + b);
  }
}
