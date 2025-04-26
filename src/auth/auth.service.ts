import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { GenerateJWTPayload, UserJWTResponse } from './types';
import { hashStr } from '../global/utils/hash';
import { SignUpDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signup(user: SignUpDto) {
    try {
      const passwordHash = await hashStr(user.password);
      user.password = passwordHash;

      return await this.usersService.create(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ConflictException(
          `User with email ${user.email} already exist.`
        );
      }

      throw new InternalServerErrorException();
    }
  }

  async validateUser(
    email: string,
    password: string
  ): Promise<UserJWTResponse | null> {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {
      const { accessToken } = this.generateJWT({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      const userJWTResponse: UserJWTResponse = {
        name: user.name,
        email: user.email,
        role: user.role,
        userId: user.id,
        accessToken,
      };

      return userJWTResponse;
    }

    return null;
  }

  generateJWT(payload: GenerateJWTPayload): {
    accessToken: string;
  } {
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
