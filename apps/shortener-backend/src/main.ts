/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

import { HttpExceptionFilter, ValidationPipeOptions } from '@libs/shared';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error'],
  });
  const httpAdapter = app.get(HttpAdapterHost);

  //swagger
  const config = new DocumentBuilder()
    .setTitle('URL Shortener API Backend Test')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT'
    )
    .addTag('Teddy, Backend-test')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  //validation pipes
  const validationPipeOptions: ValidationPipeOptions = {
    transform: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  };
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));

  const port = process.env.PORT || 3006;

  await app
    .listen(port, () => {
      Logger.log(`🚀 Application is running on: http://localhost:${port}`);
    })
    .catch((err) => Logger.error(err));
}

bootstrap();
