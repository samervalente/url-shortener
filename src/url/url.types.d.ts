import { UserJWTResponse } from 'src/auth/types';

export type ShortURLResponse = {
  shortUrl: string;
};

export type ShortURLRequestParams = {
  protocol: string;
  host: string;
  user?: UserJWTResponse;
};
