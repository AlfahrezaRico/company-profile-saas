import { Controller, Get, Post, Put, Delete, Param, Body, Header, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard.js';
import { ProductsService } from './products.service.js';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
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
