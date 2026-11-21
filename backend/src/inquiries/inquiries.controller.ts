import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard.js';
import { InquiriesService } from './inquiries.service.js';

@Controller('api/inquiries')
export class InquiriesController {
  constructor(private readonly service: InquiriesService) {}

  @UseGuards(AdminGuard)
  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.service.create(body);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: any) {
    return this.service.updateStatus(id, status);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
