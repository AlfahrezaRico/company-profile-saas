import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Headers,
  Req,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { ArticlesService } from './articles.service.js';
import { AuthService } from '../auth/auth.service.js';

@Controller('api/articles')
export class ArticlesController {
  constructor(
    private readonly service: ArticlesService,
    private readonly authService: AuthService,
  ) {}

  // Ambil token dari header Authorization atau cookie auth_token.
  private extractToken(authHeader: string | undefined, req: Request): string {
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    const cookie = req.headers.cookie;
    if (cookie) {
      const match = cookie
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith('auth_token='));
      if (match) {
        return match.split('=')[1];
      }
    }
    return '';
  }

  // Tanpa token = pengunjung publik. Token tidak valid = 401 agar admin
  // sadar sesinya berakhir, bukan diam-diam melihat data publik saja.
  private async assertAdmin(
    authHeader: string | undefined,
    req: Request,
  ): Promise<boolean> {
    const token = this.extractToken(authHeader, req);
    if (!token) {
      return false;
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

  @Get()
  async findAll(
    @Query('status') status: string,
    @Headers('authorization') authHeader: string,
    @Req() req: Request,
  ) {
    const includeDrafts = await this.assertAdmin(authHeader, req);
    return this.service.findAll(status, includeDrafts);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
    @Req() req: Request,
  ) {
    const article = await this.service.findOne(id);
    const isAdmin = await this.assertAdmin(authHeader, req);
    if (!article || (article.status !== 'PUBLISHED' && !isAdmin)) {
      throw new NotFoundException('Artikel tidak ditemukan');
    }
    return article;
  }

  @Post()
  async create(@Body() body: any) {
    return this.service.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
