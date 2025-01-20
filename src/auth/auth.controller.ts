import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto)
  }

  @Post('registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto)
  }

  @Post('checkAuth')
  async checkAuth(@Body() body: { token: string }, @Res() res: Response) {
    return this.authService.validateToken(body.token)
  }

  @Get('refresh')
  async refresh(@Res() res: Response) { 
    this.authService.refresh(res)
  }

}
