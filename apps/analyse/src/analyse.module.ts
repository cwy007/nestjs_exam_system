import { Module } from '@nestjs/common';
import { AnalyseController } from './analyse.controller';
import { AnalyseService } from './analyse.service';
import { PrismaModule } from '@app/prisma';
import { CommonModule } from '@app/common/common.module';
import { AuthGuard } from '@app/common/auth.guard';
import { RedisModule } from '@app/redis';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    CommonModule,
  ],
  controllers: [AnalyseController],
  providers: [
    AnalyseService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    }
  ],
})
export class AnalyseModule { }
