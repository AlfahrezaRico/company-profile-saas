import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard.js';
import { HeroSlidesService } from './hero-slides.service.js';

@Controller('api/hero-slides')
export class HeroSlidesController {
  constructor(private readonly service: HeroSlidesService) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() body: any) {
    return this.service.create(body);
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
