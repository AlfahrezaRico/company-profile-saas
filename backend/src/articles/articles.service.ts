import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  // Gambar thumbnail disimpan sebagai Data URL di database. Jangan kirim
  // Data URL itu di respons JSON (bisa belasan MB per artikel); ganti dengan
  // URL endpoint thumbnail yang bisa di-cache CDN. Parameter v memakai
  // updatedAt supaya URL berubah saat gambar diganti (cache-busting).
  private withPublicThumbnail(article: any, baseUrl?: string) {
    if (
      !article ||
      !baseUrl ||
      !article.thumbnailUrl ||
      !article.thumbnailUrl.startsWith('data:')
    ) {
      return article;
    }
    const version = article.updatedAt
      ? new Date(article.updatedAt).getTime()
      : Date.now();
    return {
      ...article,
      thumbnailUrl: `${baseUrl}/api/articles/${article.id}/thumbnail?v=${version}`,
    };
  }

  async findAll(status?: string, includeDrafts = false, baseUrl?: string) {
    // Pengunjung publik hanya boleh melihat artikel PUBLISHED.
    // Admin (token valid) boleh melihat semua status, dengan filter opsional.
    const where: any = {};
    if (includeDrafts) {
      if (status) {
        where.status = status;
      }
    } else {
      where.status = 'PUBLISHED';
    }
    const articles = await this.prisma.article.findMany({
      where,
      include: { category: true, author: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return articles.map((a) => this.withPublicThumbnail(a, baseUrl));
  }

  async findOne(idOrSlug: string, baseUrl?: string) {
    const article = await this.prisma.article.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        category: true,
        author: { select: { id: true, name: true, email: true } },
      },
    });
    return this.withPublicThumbnail(article, baseUrl);
  }

  // Ambil bytes thumbnail untuk endpoint /api/articles/:id/thumbnail.
  // Data URL -> decode jadi binary. URL http biasa -> redirect.
  async getThumbnail(id: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article || !article.thumbnailUrl) {
      return null;
    }
    const value: string = article.thumbnailUrl;
    if (value.startsWith('data:')) {
      const match = value.match(/^data:([^;,]+)?(;base64)?,(.*)$/s);
      if (!match) {
        return null;
      }
      const mimeType = match[1] || 'image/png';
      const isBase64 = !!match[2];
      const raw = match[3] || '';
      const buffer = isBase64
        ? Buffer.from(raw, 'base64')
        : Buffer.from(decodeURIComponent(raw), 'utf8');
      return { buffer, mimeType };
    }
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return { redirectUrl: value };
    }
    return null;
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
        // Kalau admin menyimpan tanpa mengganti gambar, form mengirim balik
        // URL endpoint thumbnail milik artikel ini sendiri. Jangan timpa Data
        // URL asli dengan URL tersebut.
        thumbnailUrl:
          data.thumbnailUrl !== undefined &&
          !(typeof data.thumbnailUrl === 'string' &&
            data.thumbnailUrl.includes(`/api/articles/${id}/thumbnail`))
            ? data.thumbnailUrl
            : existing.thumbnailUrl,
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
