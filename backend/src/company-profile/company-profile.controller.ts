import { Controller, Get, Put, Body, Header } from '@nestjs/common';
import { CompanyProfileService } from './company-profile.service.js';

@Controller('api/company-profile')
export class CompanyProfileController {
  constructor(private readonly service: CompanyProfileService) {}

  @Get()
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  async getProfile() {
    return this.service.getProfile();
  }

  @Put()
  async updateProfile(@Body() body: any) {
    return this.service.updateProfile(body);
  }
}
