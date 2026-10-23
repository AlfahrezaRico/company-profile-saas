import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UploadModule } from './upload/upload.module.js';
import { CompanyProfileModule } from './company-profile/company-profile.module.js';
import { ProductsModule } from './products/products.module.js';
import { ArticlesModule } from './articles/articles.module.js';
import { ClientsModule } from './clients/clients.module.js';
import { InquiriesModule } from './inquiries/inquiries.module.js';
import { AuthModule } from './auth/auth.module.js';
import { HeroSlidesModule } from './hero-slides/hero-slides.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UploadModule,
    CompanyProfileModule,
    ProductsModule,
    ArticlesModule,
    ClientsModule,
    InquiriesModule,
    HeroSlidesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
