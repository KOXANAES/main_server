import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersGqlModule } from 'src/users-gql/users-gql.module';
import { EmailService } from 'src/email/email.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, PrismaService, EmailService],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({})
  ], 
  exports: [
    AuthService, JwtModule
  ]
})
export class AuthModule {}
