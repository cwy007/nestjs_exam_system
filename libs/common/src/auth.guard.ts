import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { UnLoginException } from './unlogin.filter';

@Injectable()
export class AuthGuard implements CanActivate {

  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireLogin) {
      return true;
    }

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnLoginException('用户未登录');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnLoginException('用户未登录');
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;

      // 刷新token，延长用户登录状态
      response.header('token', this.jwtService.sign(
        { userId: decoded.userId, username: decoded.username },
        { expiresIn: '7d' },
      ));

      return true;
    } catch (error) {
      throw new UnauthorizedException('token无效，请重新登录');
    }
  }
}
