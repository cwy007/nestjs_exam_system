import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthGuard, CommonModule } from '@app/common';
import { PrismaModule } from '@app/prisma';
import { ExcelModule } from '@app/excel';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EXAM_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 8888,
        },
      }
    ]),
    PrismaModule,
    CommonModule,
    ExcelModule,
  ],
  controllers: [AnswerController],
  providers: [
    AnswerService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    }
  ],
})
export class AnswerModule { }
