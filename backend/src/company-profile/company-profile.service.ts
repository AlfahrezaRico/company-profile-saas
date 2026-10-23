import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CompanyProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile() {
    let profile = await this.prisma.companyProfile.findFirst();
    if (!profile) {
      profile = await this.prisma.companyProfile.create({
        data: {
          companyName: 'PT Nusantara Tech Digital',
          tagline: 'Enterprise Digital & Cloud Solutions',
          logoUrl: '',
          about:
            'PT Nusantara Tech Digital adalah perusahaan rekayasa perangkat lunak enterprise dan solusi transformasi digital terkemuka yang berbasis di Jakarta, Indonesia.',
          vision:
            'Menjadi mitra teknologi nomor satu di Asia Tenggara dalam menciptakan ekosistem bisnis digital yang tangguh dan berkelanjutan.',
          mission:
            'Menghadirkan solusi teknologi mutakhir dengan transparansi tinggi, keamanan berstandar internasional, serta layanan purna jual yang sigap 24/7.',
          address: 'Menara Nusantara Lt. 24, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan, 12190',
          email: 'halo@nusantaratech.id',
          phone: '+62 (21) 5088-7890',
          whatsapp: '+62 812-3456-7890',
          linkedin: 'https://linkedin.com/company/nusantara-tech',
          instagram: 'https://instagram.com/nusantaratech.id',
        },
      });
    }
    return profile;
  }

  async updateProfile(data: any) {
    const existing = await this.getProfile();
    return this.prisma.companyProfile.update({
      where: { id: existing.id },
      data: {
        companyName: data.companyName ?? existing.companyName,
        tagline: data.tagline ?? existing.tagline,
        logoUrl: data.logoUrl !== undefined ? data.logoUrl : existing.logoUrl,
        faviconUrl: data.faviconUrl !== undefined ? data.faviconUrl : existing.faviconUrl,
        heroBgUrl: data.heroBgUrl !== undefined ? data.heroBgUrl : existing.heroBgUrl,
        about: data.about ?? existing.about,
        vision: data.vision ?? existing.vision,
        mission: data.mission ?? existing.mission,
        address: data.address ?? existing.address,
        email: data.email ?? existing.email,
        phone: data.phone ?? existing.phone,
        whatsapp: data.whatsapp !== undefined ? data.whatsapp : existing.whatsapp,
        linkedin: data.linkedin !== undefined ? data.linkedin : existing.linkedin,
        instagram: data.instagram !== undefined ? data.instagram : existing.instagram,
      },
    });
  }
}
