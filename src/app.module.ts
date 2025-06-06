import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersGqlModule } from './users-gql/users-gql.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email/email.service';
import { AppDownloadModule } from './app-download/app-download.module';
import { AppController } from './app.controller';
import { CardsModule } from './cards/cards.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: '"nest-modules" <koxanaes@mail.ru>',
      },
    }),



    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    UsersModule,
    UsersGqlModule,
    AuthModule,
    AppDownloadModule,
    CardsModule,
    AiModule
  ],
  controllers: [AppController],
  providers: [EmailService],
})
export class AppModule {}
