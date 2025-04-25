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
    console.log('exception', typeof exception);
    console.log(
      'is prisma',
      exception instanceof PrismaClientKnownRequestError
    );
    console.log('exception', exception);
    console.log('name', exception.name ?? '');

    let httpStatus: number = HttpStatus.BAD_REQUEST;
    let message: string | string[] =
      exception.message ?? 'An unknown error ocurred';

    //HTTPExcetptions
    if (exception.name === 'HttpException') {
      const error = exception as HttpException;
      httpStatus = error.getStatus();
      const response = error.getResponse() as string | string[];

      message = response;
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
