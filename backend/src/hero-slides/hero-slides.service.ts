import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class HeroSlidesService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    // Seed initial default slides if table is empty
    const count = await this.prisma.heroSlide.count();
    if (count === 0) {
      await this.prisma.heroSlide.createMany({
        data: [
          {
            title: 'Membangun Fondasi Digital Tangguh untuk Pertumbuhan Bisnis',
            subtitle:
              'Kami memadukan standar rekayasa software berkinerja tinggi, arsitektur cloud aman, dan ekosistem digital terintegrasi untuk akselerasi pertumbuhan perusahaan Anda.',
            badge: 'SOLUSI TEKNOLOGI ENTERPRISE TERPERCAYA',
            primaryCtaText: 'Konsultasi Proyek Gratis',
            primaryCtaUrl: '#contact',
            secondaryCtaText: 'Jelajahi Layanan Kami',
            secondaryCtaUrl: '#services',
            orderIndex: 1,
            isActive: true,
          },
          {
            title: 'Infrastruktur Cloud Skalabel dengan Keamanan Siber Standar Global',
            subtitle:
              'Optimasi beban server, otomatisasi workflow DevOps, dan perlindungan data transaksi dengan enkripsi AES-256 serta sertifikasi ISO 27001.',
            badge: 'INFRASTRUKTUR CLOUD & KEAMANAN TINGGI',
            primaryCtaText: 'Diskusikan Arsitektur Cloud',
            primaryCtaUrl: '#contact',
            secondaryCtaText: 'Lihat Sertifikasi Kami',
            secondaryCtaUrl: '#about',
            orderIndex: 2,
            isActive: true,
          },
          {
            title: 'Transformasi Digital Cerdas Berbasis AI & Analitik Prediktif',
            subtitle:
              'Tingkatkan efisiensi operasional hingga 40% dengan integrasi sistem kecerdasan buatan, visualisasi data real-time, dan otomasi proses bisnis.',
            badge: 'AI & DATA ANALYTICS INTEGRATION',
            primaryCtaText: 'Mulai Transformasi Digital',
            primaryCtaUrl: '#contact',
            secondaryCtaText: 'Baca Wawasan Terbaru',
            secondaryCtaUrl: '/articles',
            orderIndex: 3,
            isActive: true,
          },
        ],
      });
      console.log('Seeded initial hero slides.');
    }
  }

  async findAll() {
    return this.prisma.heroSlide.findMany({
      orderBy: { orderIndex: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.heroSlide.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.heroSlide.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        badge: data.badge || 'SOLUSI ENTERPRISE TERPERCAYA',
        layout: data.layout || 'CENTER',
        primaryCtaText: data.primaryCtaText || 'Konsultasi Proyek Gratis',
        primaryCtaUrl: data.primaryCtaUrl || '#contact',
        secondaryCtaText: data.secondaryCtaText || 'Jelajahi Layanan Kami',
        secondaryCtaUrl: data.secondaryCtaUrl || '#services',
        splitTitle: data.splitTitle || null,
        splitSubtitle: data.splitSubtitle || null,
        splitCtaText: data.splitCtaText || null,
        splitCtaUrl: data.splitCtaUrl || null,
        imageUrl: data.imageUrl || null,
        orderIndex: data.orderIndex !== undefined ? Number(data.orderIndex) : 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });
  }

  async update(id: string, data: any) {
    const existing = await this.prisma.heroSlide.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Hero slide tidak ditemukan');
    }
    return this.prisma.heroSlide.update({
      where: { id },
      data: {
        title: data.title ?? existing.title,
        subtitle: data.subtitle ?? existing.subtitle,
        badge: data.badge !== undefined ? data.badge : existing.badge,
        layout: data.layout !== undefined ? data.layout : (existing as any).layout || 'CENTER',
        primaryCtaText: data.primaryCtaText !== undefined ? data.primaryCtaText : existing.primaryCtaText,
        primaryCtaUrl: data.primaryCtaUrl !== undefined ? data.primaryCtaUrl : existing.primaryCtaUrl,
        secondaryCtaText: data.secondaryCtaText !== undefined ? data.secondaryCtaText : existing.secondaryCtaText,
        secondaryCtaUrl: data.secondaryCtaUrl !== undefined ? data.secondaryCtaUrl : existing.secondaryCtaUrl,
        splitTitle: data.splitTitle !== undefined ? data.splitTitle : (existing as any).splitTitle,
        splitSubtitle: data.splitSubtitle !== undefined ? data.splitSubtitle : (existing as any).splitSubtitle,
        splitCtaText: data.splitCtaText !== undefined ? data.splitCtaText : (existing as any).splitCtaText,
        splitCtaUrl: data.splitCtaUrl !== undefined ? data.splitCtaUrl : (existing as any).splitCtaUrl,
        imageUrl: data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl,
        orderIndex: data.orderIndex !== undefined ? Number(data.orderIndex) : existing.orderIndex,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : existing.isActive,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.heroSlide.delete({ where: { id } });
  }
}
