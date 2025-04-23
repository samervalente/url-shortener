import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ValidationPipeOptions } from './global/types';
import { HttpExceptionFilter } from './global/http-exception-filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);

  //swagger
  const config = new DocumentBuilder()
    .setTitle('URL Shortener API Backend Test')
    .setDescription('')
    .setVersion('1.0')
    .addTag('Teddy, Backend-test')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // version
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  //validation pipes
  const validationPipeOptions: ValidationPipeOptions = {
    transform: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  };
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));
  app.use(json());

  const port = process.env.PORT ?? 3003;

  await app
    .listen(port, () => {
      console.log(`Server available on port ${port}`);
    })
    .catch((err) => Logger.error(err));
}
bootstrap();
