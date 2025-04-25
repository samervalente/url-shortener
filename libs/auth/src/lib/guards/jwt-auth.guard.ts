import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserJWTResponse } from '../types';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@libs/shared';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  override canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  override handleRequest<TUser = UserJWTResponse>(
    err: any,
    user: TUser,
    info: { name: string; message: string }
  ): TUser {
    if (info) {
      if (info.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Login session expired. Please log in again'
        );
      }

      if (info.message === 'invalid signature') {
        throw new UnauthorizedException('Invalid token signature.');
      }

      if (info.message === 'No auth token') {
        throw new UnauthorizedException('No auth token provided.');
      }
      if (info.message === 'jwt malformed') {
        throw new UnauthorizedException('Invalid auth token provided.');
      }
    }
    return user;
  }
}
