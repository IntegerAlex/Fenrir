// src/auth/auth.controller.ts
import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const { passKey } = req.body;
    const sessionId = await this.authService.login(passKey);
    if (sessionId) {
      res.cookie('sessionId', sessionId, { httpOnly: true, secure: false });
      return res.status(200).json({ message: 'Login successful' });
    }
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
