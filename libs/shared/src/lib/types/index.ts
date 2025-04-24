import { ValidationError } from '@nestjs/common';
import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { RoleEnum } from 'db/iam';

export type UserJWTResponse = {
  userId: string;
  name: string;
  email: string;
  accessToken: string;
  role: RoleEnum;
};

export type GenerateJWTPayload = {
  sub: string;
  email: string;
  role: RoleEnum;
};

export interface ValidationPipeOptions extends ValidatorOptions {
  transform?: boolean;
  disableErrorMessages?: boolean;
  exceptionFactory?: (errors: ValidationError[]) => unknown;
  whitelist?: boolean;
  forbidNonWhitelisted?: true;
}

declare module 'express' {
  interface Request {
    user?: UserJWTResponse;
  }
}
