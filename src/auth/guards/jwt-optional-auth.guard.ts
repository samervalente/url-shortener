// jwt-optional-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserJWTResponse } from '../types';

@Injectable()
export class JwtOptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = UserJWTResponse>(err: any, user: TUser): TUser | null {
    return user || null;
  }
}
