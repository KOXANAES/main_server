import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3001
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // Разрешаем только этот источник
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Разрешаем указанные методы
    credentials: true, // Разрешаем отправку куки
  });    await app.listen(PORT, () => console.log(`server is working on port ${PORT}`))
}
bootstrap();
