import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { CompanyProfileController } from './company-profile.controller.js';
import { CompanyProfileService } from './company-profile.service.js';

@Module({
  imports: [AuthModule],
  controllers: [CompanyProfileController],
  providers: [CompanyProfileService],
  exports: [CompanyProfileService],
})
export class CompanyProfileModule {}
