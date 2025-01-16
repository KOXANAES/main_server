import { forwardRef, Module } from '@nestjs/common';
import { UsersGqlService } from './users-gql.service';
import { UsersGqlResolver } from './users-gql.resolver';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [UsersGqlResolver, UsersGqlService, UsersService, PrismaService, JwtService],
})
export class UsersGqlModule {}
