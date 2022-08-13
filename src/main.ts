import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['debug', 'error', 'log', 'verbose', 'warn']
  });
}
bootstrap();
