import { Controller, Get, Inject } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
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
}
