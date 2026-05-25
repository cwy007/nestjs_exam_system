import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: 'your_jwt_secret_key',
        signOptions: { expiresIn: '1h' },
      }),
    })
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule { }
