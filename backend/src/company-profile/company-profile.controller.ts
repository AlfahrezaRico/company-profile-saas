import { Controller, Get, Put, Body, Header, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard.js';
import { CompanyProfileService } from './company-profile.service.js';

@Controller('api/company-profile')
export class CompanyProfileController {
  constructor(private readonly service: CompanyProfileService) {}

  @Get()
  // Cache singkat di CDN: profil jarang berubah, respons ~200KB dipanggil di
  // setiap halaman. Perubahan dari admin tampil publik maksimal 5 menit.
  @Header('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
  async getProfile() {
    return this.service.getProfile();
  }

  @UseGuards(AdminGuard)
  @Put()
  async updateProfile(@Body() body: any) {
    return this.service.updateProfile(body);
  }
}
