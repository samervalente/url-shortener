import { $Enums } from '@prisma/client';

export type UserJWTResponse = {
  userId: string;
  name: string;
  email: string;
  accessToken: string;
  role: $Enums.RoleEnum;
};

export type GenerateJWTPayload = {
  sub: string;
  email: string;
  role: $Enums.RoleEnum;
};
