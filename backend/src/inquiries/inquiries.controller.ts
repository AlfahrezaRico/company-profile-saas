import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { InquiriesService } from './inquiries.service.js';

@Controller('api/inquiries')
export class InquiriesController {
  constructor(private readonly service: InquiriesService) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.service.create(body);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: any) {
    return this.service.updateStatus(id, status);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
