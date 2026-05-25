import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { RedisModule } from '@app/redis';
import { AuthGuard, CommonModule } from '@app/common';
import { PrismaModule } from '@app/prisma/prisma.module';

@Module({
  imports: [
    RedisModule,
    PrismaModule,
    CommonModule,
  ],
  controllers: [ExamController],
  providers: [
    ExamService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    }
  ],
})
export class ExamModule { }
