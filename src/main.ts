import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { AppModule } from './app.module';
import { generateKeys } from './generate-keys';
import { setupSwagger } from './swagger';
import { HttpExceptionFilter } from './filters/httpException';
import { PostInterceptor } from './interceptors/post.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import compression from 'compression';
import path from 'path';
import bodyParser from 'body-parser';

async function bootstrap(): Promise<any> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const options = {
    origin: config.app.origin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  };

  app.enableCors(options);
  Object.assign(global, {
    __basedir: path.resolve(__dirname, '../'),
  });
  app.use(
    rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validationError: {
        target: false,
      },
    }),
  );
  app.use(
    bodyParser.urlencoded({
      extended: false,
    }),
  );
  app.use(compression());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new PostInterceptor(),
    new LoggingInterceptor(),
  );
  app.setGlobalPrefix('api/v1');
  app.setBaseViewsDir(path.join(__dirname, './', 'views'));
  setupSwagger(app);
  await app.listen(config.app.port);
  generateKeys();
}

bootstrap();
