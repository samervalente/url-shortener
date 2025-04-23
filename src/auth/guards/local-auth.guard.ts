import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserJWTResponse } from '../types';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LocalAuthGuard {
  export type ReqType = {
    user: UserJWTResponse;
  };
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
