import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;

  constructor(private prisma: PrismaService) {
    this.jwtSecret = process.env.JWT_SECRET || 'super_secret_jwt_company_profile_key_2026';
  }

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email atau kata sandi tidak ditemukan.');
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Kata sandi yang Anda masukkan salah.');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(email: string, pass: string) {
    const user = await this.validateUser(email, pass);
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      this.jwtSecret,
      { expiresIn: '7d' },
    );

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.name,
      },
    };
  }

  async verifyToken(token: string) {
    try {
      const payload: any = jwt.verify(token, this.jwtSecret);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException('Sesi tidak valid.');
      }
      const { passwordHash, ...result } = user;
      return result;
    } catch (err) {
      throw new UnauthorizedException('Token sesi telah kedaluwarsa atau tidak valid.');
    }
  }

  async changePassword(userId: string, oldPass: string, newPass: string) {
    if (!newPass || newPass.length < 6) {
      throw new BadRequestException('Kata sandi baru minimal harus 6 karakter.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Pengguna tidak ditemukan.');
    }

    const isMatch = await bcrypt.compare(oldPass, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Kata sandi lama yang Anda masukkan tidak sesuai.');
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPass, salt);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    return {
      success: true,
      message: 'Kata sandi berhasil diperbarui.',
    };
  }
}
