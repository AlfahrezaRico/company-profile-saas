import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!body || !body.email || !body.password) {
      throw new UnauthorizedException('Email dan kata sandi wajib diisi.');
    }
    const result = await this.authService.login(body.email, body.password);

    // Terapkan Cookie Best Practice (7 hari, SameSite=Lax)
    res.cookie('auth_token', result.token, {
      httpOnly: false, // Refine client dapat membaca jika dibutuhkan
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result;
  }

  @Get('me')
  async getProfile(
    @Headers('authorization') authHeader: string,
    @Req() req: Request,
  ) {
    let token = '';

    // Prioritas 1: Bearer Header
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.headers.cookie) {
      // Prioritas 2: Cookie auth_token
      const match = req.headers.cookie
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith('auth_token='));
      if (match) {
        token = match.split('=')[1];
      }
    }

    if (!token) {
      throw new UnauthorizedException('Token autentikasi tidak ditemukan.');
    }

    return this.authService.verifyToken(token);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token', { path: '/' });
    return { success: true, message: 'Berhasil keluar (logout)' };
  }
}

