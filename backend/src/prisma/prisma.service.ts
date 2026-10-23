import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString =
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgrespassword@localhost:5432/company_profile?schema=public';
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✓ Terhubung dengan Database PostgreSQL');
    } catch (error) {
      console.warn(
        '⚠️ Belum dapat terhubung ke PostgreSQL database. Pastikan instance PostgreSQL / Docker sudah aktif.'
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
