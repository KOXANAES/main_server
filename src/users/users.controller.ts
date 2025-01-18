import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/guards/role.guard';
import { Role } from '@prisma/client';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get('findAll')
  findAll() { 
    return this.usersService.findAll()
  }
 
  @Post('createUser')
  createUser(@Body() userDto: CreateUserDto) { 
    return this.usersService.createUser(userDto)
  }

  @Get('/activate/:link')
  async activateAcc(@Param('link') activationLink: string, @Res() res: Response) { 
    await this.usersService.activate(activationLink);
    return res.redirect(process.env.CLIENT_URL);
  }

}
