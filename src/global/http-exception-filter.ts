import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message: string =
      exception instanceof Error
        ? exception.message
        : 'An unknown error occurred';

    const exceptionRawObject: unknown =
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
