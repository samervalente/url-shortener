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
import { constants } from '../../constants';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(
    exception: HttpException | PrismaClientKnownRequestError,
    host: ArgumentsHost
  ): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let httpStatus: number = HttpStatus.BAD_REQUEST;
    let message: string | string[] =
      exception.message ?? 'An unknown error ocurred';

    //HttpExceptions
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();

      const response = exception.getResponse() as {
        message: string | string[];
      };

      message = response.message;
    }

    //Prisma errors
    if (exception.name === 'PrismaClientKnownRequestError') {
      const error = exception as PrismaClientKnownRequestError;
      const prismaErrorCodeMap: Record<
        PrismaClientKnownRequestError['code'],
        number
      > = {
        [constants.PRISMA_NOT_FOUND_ERROR_CODE]: HttpStatus.NOT_FOUND,
        [constants.PRISMA_CONFLICT_ERROR_CODE]: HttpStatus.CONFLICT,
      };

      httpStatus = prismaErrorCodeMap[error.code];
      message = error.meta?.['cause'] as string;
    }

    const exceptionRawObject =
      exception &&
      typeof exception === 'object' &&
      Object.keys(exception).length > 0
        ? exception
        : exception?.toString();

    const stack = exception instanceof Error ? exception.stack : null;

    Logger.error(
      `HTTPExceptionFilter:  exceptionRawObject: ${JSON.stringify(
        exceptionRawObject
      )} stack: ${JSON.stringify(stack)}`
    );

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
