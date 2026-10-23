import { Controller, Get, Put, Body, Header } from '@nestjs/common';
import { CompanyProfileService } from './company-profile.service.js';

@Controller('api/company-profile')
export class CompanyProfileController {
  constructor(private readonly service: CompanyProfileService) {}

  @Get()
  @Header('Cache-Control', 'public, max-age=60, s-maxage=300')
  async getProfile() {
    return this.service.getProfile();
  }

  @Put()
  async updateProfile(@Body() body: any) {
    return this.service.updateProfile(body);
  }
}
