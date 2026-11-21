import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { HeroSlidesService } from './hero-slides.service.js';
import { HeroSlidesController } from './hero-slides.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [HeroSlidesController],
  providers: [HeroSlidesService],
  exports: [HeroSlidesService],
})
export class HeroSlidesModule {}
