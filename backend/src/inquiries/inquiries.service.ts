import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class InquiriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: any) {
    return this.prisma.inquiry.create({
      data: {
        fullName: data.fullName || data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        message: data.message,
        status: 'UNREAD',
      },
    });
  }

  async updateStatus(id: string, status: any) {
    return this.prisma.inquiry.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    return this.prisma.inquiry.delete({ where: { id } });
  }
}
