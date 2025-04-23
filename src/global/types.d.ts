import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { User } from '@prisma/client';
import { UserJWTResponse } from 'src/auth/types';

export interface ValidationPipeOptions extends ValidatorOptions {
  transform?: boolean;
  disableErrorMessages?: boolean;
  exceptionFactory?: (errors: ValidationError[]) => any;
  whitelist?: boolean;
  forbidNonWhitelisted?: true;
}

export type UserPublic = Omit<User, 'password'> | null;

declare namespace ExpressRequest {
  interface ReqType {
    user: UserJWTResponse;
  }
}

declare module 'express' {
  interface Request {
    user?: UserJWTResponse;
  }
}
