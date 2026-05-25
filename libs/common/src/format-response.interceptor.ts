import { CallHandler, ExecutionContext, Injectable, NestInterceptor, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(map((data) => {
      // 文件流/二进制响应直接放行，避免被 JSON 包装导致下载失败
      if (data instanceof StreamableFile || Buffer.isBuffer(data)) {
        return data;
      }
      return {
        code: response.statusCode,
        message: 'success',
        data,
      };
    }));
  }
}
