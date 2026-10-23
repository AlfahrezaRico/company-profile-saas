import { Module } from '@nestjs/common';
import { HeroSlidesService } from './hero-slides.service.js';
import { HeroSlidesController } from './hero-slides.controller.js';

@Module({
  controllers: [HeroSlidesController],
  providers: [HeroSlidesService],
  exports: [HeroSlidesService],
})
export class HeroSlidesModule {}
