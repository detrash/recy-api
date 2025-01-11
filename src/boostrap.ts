import './tracing';

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { corsOptionsDelegate } from './config/cors.config';
import { jwtDevelopment } from './config/jwt.development';
import { AllExceptionsFilter } from './exception-filter';
import { setupSwagger } from './shared/swagger/swagger.controller';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.use(cookieParser());

  const logger = app.get(Logger);

  app.useLogger(logger);
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  await setupSwagger(app);

  if (process.env.NODE_ENV === 'development') {
    await jwtDevelopment();
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableCors(corsOptionsDelegate);

  logger.log('BOOTSTRAPPED SUCCESSFULLY');

  const port = process.env.PORT || 3333;
  await app.listen(port);
  logger.log(`Application running on port ${port}`, 'Bootstrap');
}
