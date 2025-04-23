import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';

import { SignUpDto } from './auth.dto';
import { LoginCredentialsDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/guards.decorator';
import { randomUUID } from 'crypto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name, {
    timestamp: true,
  });
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiResponse({
    status: 201,
    description: 'User account created successfully.',
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists.',
  })
  @ApiBody({ type: SignUpDto })
  signup(@Body() body: SignUpDto) {
    const logIdentifier = randomUUID();
    this.logger.log(`[${logIdentifier}] - new signup request with body`, body);

    return this.authService.signup(body);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and return access token' })
  @ApiResponse({
    status: 200,
    description: 'User authenticated successfully.',
    schema: {
      example: {
        accessToken: 'JWT access token',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: LoginCredentialsDTO })
  login(
    @Request() req: LocalAuthGuard.ReqType,
    @Body() loginCredentialsDTO: LoginCredentialsDTO,
  ): {
    accessToken: string;
  } {
    const logIdentifier = randomUUID();
    this.logger.log(
      `[${logIdentifier}] - new login request with email ${loginCredentialsDTO.email}`,
    );

    return {
      accessToken: req.user.accessToken,
    };
  }
}
