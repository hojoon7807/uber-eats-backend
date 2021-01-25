import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { jwtMiddleware } from './jwt/jwt.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(jwtMiddleware);
  app.useGlobalPipes(new ValidationPipe()) //for validator pipe setting
  await app.listen(3000);
}
bootstrap();
