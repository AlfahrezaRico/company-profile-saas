import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async create(data: any) {
    const slug =
      data.slug ||
      data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    return this.prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description || '',
        shortDesc: data.shortDesc || '',
        isFeatured: data.isFeatured ?? false,
        galleryUrls: data.galleryUrls || [],
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        shortDesc: data.shortDesc,
        isFeatured: data.isFeatured,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
