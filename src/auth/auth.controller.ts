import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/user.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() userDto: CreateUserDto, @Res() res: Response) {
    try { 
      const userData = await this.authService.login(userDto)
      res.cookie('refreshToken', userData.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: , // Set secure based on environment
      })
      return res.status(201).json(userData);
    } catch(e) { 
      console.error('Registration error:', e);
      return res.status(500).json({ message: 'Registration failed', error: e.message });
    }
  }

  @Post('registration')
  async registration(@Res() res: Response, @Body() userDto: CreateUserDto) {
    try { 
      const userData = await this.authService.registration(userDto);
      res.cookie('refreshToken', userData.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: , // Set secure based on environment
      });
        return res.status(201).json(userData);
    } catch(e) { 
        console.error('Registration error:', e);
        return res.status(500).json({ message: 'Registration failed', error: e.message });
    }
  }

  // @Post('checkAuth')
  // async checkAuth(@Body() body: { token: string }, @Res() res: Response) {
  //   return this.authService.validateToken(body.token)
  // }

  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    try { 
      const { refreshToken } = req.cookies;
      const userData = await this.authService.refresh(refreshToken)
      res.cookie('refreshToken', userData.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: , // Set secure based on environment
      });
        return res.status(201).json(userData);
    } catch(e) { 
        console.error('Registration error:', e);
        return res.status(500).json({ message: 'Registration failed', error: e.message });
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {return res.status(400).json({ message: 'No refresh token provided' })}
    try {
      const result = await this.authService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.status(200).json(result);
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ message: 'Logout failed', error: error.message });
    }
  }
}
