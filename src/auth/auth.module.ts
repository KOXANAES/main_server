import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersGqlModule } from 'src/users-gql/users-gql.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, PrismaService],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'wvo-93483f4g354hb',
      signOptions: { 
        expiresIn: '24h'
      }
    })
  ], 
  exports: [
    AuthService, JwtModule
  ]
})
export class AuthModule {}
