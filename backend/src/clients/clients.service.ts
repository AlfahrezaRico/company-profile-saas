import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: any) {
    return this.prisma.client.create({
      data: {
        companyName: data.companyName,
        category: data.category || '',
        websiteUrl: data.websiteUrl || '',
        logoUrl: data.logoUrl || null,
        isActive: data.isActive ?? true,
      },
    });
  }

  async update(id: string, data: any) {
    const existing = await this.prisma.client.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Mitra / Klien tidak ditemukan');
    }
    return this.prisma.client.update({
      where: { id },
      data: {
        companyName: data.companyName ?? existing.companyName,
        category: data.category !== undefined ? data.category : existing.category,
        websiteUrl: data.websiteUrl !== undefined ? data.websiteUrl : existing.websiteUrl,
        logoUrl: data.logoUrl !== undefined ? data.logoUrl : existing.logoUrl,
        isActive: data.isActive !== undefined ? data.isActive : existing.isActive,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.client.delete({ where: { id } });
  }
}
