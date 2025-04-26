import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserJWTResponse } from '../types';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators/guards.decorator';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = UserJWTResponse>(
    err: any,
    user: TUser,
    info: { name: string; message: string }
  ): TUser {
    if (info) {
      if (info.name === 'TokenExpiredError') {
        throw new HttpException(
          'Login session expired. Please log in again',
          HttpStatus.FORBIDDEN
        );
      }

      if (info.message === 'invalid signature') {
        throw new HttpException(
          'Invalid token signature.',
          HttpStatus.UNAUTHORIZED
        );
      }

      if (info.message === 'No auth token') {
        throw new HttpException(
          'No auth token provided.',
          HttpStatus.UNAUTHORIZED
        );
      }
      if (info.message === 'jwt malformed') {
        throw new HttpException(
          'Invalid auth token provided.',
          HttpStatus.UNAUTHORIZED
        );
      }
    }
    return user;
  }
}
