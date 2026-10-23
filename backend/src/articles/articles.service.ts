import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.article.findMany({
      include: { category: true, author: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(idOrSlug: string) {
    return this.prisma.article.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        category: true,
        author: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async create(data: any) {
    const slug =
      data.slug ||
      data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    // Pastikan default author ada jika authorId tidak diberikan
    let authorId = data.authorId;
    if (!authorId) {
      let defaultUser = await this.prisma.user.findFirst();
      if (!defaultUser) {
        defaultUser = await this.prisma.user.create({
          data: {
            name: 'Administrator',
            email: 'admin@nusantaratech.id',
            passwordHash: 'hashed_password',
            role: 'SUPERADMIN',
          },
        });
      }
      authorId = defaultUser.id;
    }

    return this.prisma.article.create({
      data: {
        title: data.title,
        slug,
        content: data.content || '',
        excerpt: data.excerpt || '',
        thumbnailUrl: data.thumbnailUrl,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        status: data.status || 'PUBLISHED',
        publishedAt: new Date(),
        authorId,
        categoryId: data.categoryId || null,
      },
      include: {
        category: true,
        author: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async update(id: string, data: any) {
    const existing = await this.prisma.article.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Artikel tidak ditemukan');
    }
    return this.prisma.article.update({
      where: { id },
      data: {
        title: data.title ?? existing.title,
        slug: data.slug ?? existing.slug,
        content: data.content ?? existing.content,
        excerpt: data.excerpt !== undefined ? data.excerpt : existing.excerpt,
        thumbnailUrl: data.thumbnailUrl !== undefined ? data.thumbnailUrl : existing.thumbnailUrl,
        status: data.status ?? existing.status,
        categoryId: data.categoryId !== undefined ? data.categoryId : existing.categoryId,
      },
      include: {
        category: true,
        author: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.article.delete({ where: { id } });
  }
}
