import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard.js';
import { ClientsService } from './clients.service.js';

@Controller('api/clients')
export class ClientsController {
  constructor(private readonly service: ClientsService) {}

  @Get()
  async findAll() {
    return this.service.findAll();
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
