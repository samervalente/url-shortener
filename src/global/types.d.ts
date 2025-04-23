import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { User } from '@prisma/client';

export interface ValidationPipeOptions extends ValidatorOptions {
  transform?: boolean;
  disableErrorMessages?: boolean;
  exceptionFactory?: (errors: ValidationError[]) => any;
  whitelist?: boolean;
  forbidNonWhitelisted?: true;
}

export type UserPublic = Omit<User, 'password'> | null;
