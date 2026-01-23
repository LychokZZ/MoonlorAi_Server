import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://192.168.0.110:3000', 'http://localhost:3000'],
    credentials: true,
  });
  await app.listen(process.env.PORT);



}
bootstrap();
