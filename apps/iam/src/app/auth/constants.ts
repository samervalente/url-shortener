interface JWTConstants {
  secret: string;
}

import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

export const jwtConstants: JWTConstants = {
  secret: process.env.ACCESS_TOKEN_SECRET as string, //PEM-encoded public key
};
