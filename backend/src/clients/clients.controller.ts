import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ClientsService } from './clients.service.js';

@Controller('api/clients')
export class ClientsController {
  constructor(private readonly service: ClientsService) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.service.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
