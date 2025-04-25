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
