import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['debug', 'error', 'log', 'verbose', 'warn']
  });
}
bootstrap();
