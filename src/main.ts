import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
  const PORT = process.env.PORT || 3001;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser())
  app.useStaticAssets(join(__dirname, '..', 'uploads', 'avatars', 'default'), {
    prefix: '/uploads/avatars/default/',
  });
  app.useStaticAssets(join(__dirname, '..', 'uploads', 'avatars', 'users'), {
    prefix: '/uploads/avatars/users/',
  });
  app.enableCors({
    origin: true,
    // origin: process.env.CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(PORT, () => console.log(`server is working on port ${PORT}`));
}
bootstrap();
