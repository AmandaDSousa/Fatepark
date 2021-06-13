import {NestFactory} from '@nestjs/core';
import {ValidationPipe} from "@nestjs/common";

import { AppModule } from './app.module';
import {AllExceptionsFilter} from "./filters/all-exceptions.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new AllExceptionsFilter())

  await app.listen(4000);
}

bootstrap();
