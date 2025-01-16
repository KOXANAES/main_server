import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/guards/role.guard';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @Get('findAll')
  findAll() { 
    return this.usersService.findAll()
  }
 
  @Post('createUser')
  createUser(@Body() userDto: CreateUserDto) { 
    return this.usersService.createUser(userDto)
  }

}
