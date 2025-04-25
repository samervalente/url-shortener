import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { UserJWTResponse } from '@libs/auth';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(
    email: string,
    password: string
  ): Promise<UserJWTResponse | UnauthorizedException> {
    const userJWTResponse: UserJWTResponse | null =
      await this.authService.validateUser(email, password);

    if (!userJWTResponse) {
      throw new UnauthorizedException();
    }

    return userJWTResponse;
  }
}
