import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const PORT = process.env.PORT || 3001
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // Разрешаем только этот источник
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Разрешаем указанные методы
    credentials: true, // Разрешаем отправку куки
  }); 
  app.useStaticAssets(join(__dirname, '..', 'downloads'), {
    prefix: '/downloads/', // URL префикс для доступа к файлам
  });
  await app.listen(PORT, () => console.log(`server is working on port ${PORT}`))
}
bootstrap();
