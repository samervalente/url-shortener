import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus: number = HttpStatus.BAD_REQUEST;
    let message: string = 'A unknown error ocurred';
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      message = exception.message;
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      const prismaErrorCodeMap: Record<
        PrismaClientKnownRequestError['code'],
        number
      > = {
        P2025: HttpStatus.NOT_FOUND,
        P2002: HttpStatus.CONFLICT,
      };

      httpStatus = prismaErrorCodeMap[exception.code];

      message = (exception.meta?.cause as string) ?? exception.message;
    }

    const exceptionRawObject =
      exception &&
      typeof exception === 'object' &&
      Object.keys(exception).length > 0
        ? exception
        : exception?.toString();

    const stack = exception instanceof Error ? exception.stack : null;

    Logger.error(
      `HTTPExceptionFilter:  exceptionRawObject: ${JSON.stringify(exceptionRawObject)} stack: ${JSON.stringify(
        stack,
      )}`,
    );

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
