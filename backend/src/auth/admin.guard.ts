import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';

// Wajib admin untuk endpoint tulis CMS: token JWT dari header
// Authorization: Bearer ... atau cookie auth_token.
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.headers.cookie) {
      const match = req.headers.cookie
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith('auth_token='));
      if (match) {
        token = match.split('=')[1];
      }
    }

    if (!token) {
      throw new UnauthorizedException(
        'Login admin diperlukan untuk mengubah data.',
      );
    }

    try {
      await this.authService.verifyToken(token);
      return true;
    } catch {
      throw new UnauthorizedException(
        'Token sesi telah kedaluwarsa atau tidak valid.',
      );
    }
  }
}
