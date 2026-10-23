import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname, join } from 'path';
import { promises as fs } from 'fs';
import { put } from '@vercel/blob';

@Controller('api/upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req: any, file: any, cb: any) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|svg\+xml)$/)) {
          return cb(
            new BadRequestException(
              'Hanya berkas gambar (JPG, PNG, WebP, SVG) yang diperbolehkan!',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async uploadFile(@UploadedFile() file: any) {
    if (!file || !file.buffer) {
      throw new BadRequestException('Berkas gambar tidak ditemukan.');
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const filename = `logo-${uniqueSuffix}${ext}`;

    // 1. CLOUD MODE: If Vercel Blob token is configured (Production Vercel)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(filename, file.buffer, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        return {
          success: true,
          url: blob.url,
          filename: filename,
        };
      } catch (err: any) {
        console.error('Vercel Blob upload failed:', err);
        throw new BadRequestException(
          `Gagal mengunggah ke Cloud Storage: ${err.message}`,
        );
      }
    }

    // 2. LOCAL DEV MODE: Save to local ./uploads directory
    const uploadDir = join(process.cwd(), 'uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(join(uploadDir, filename), file.buffer);
    } catch (err: any) {
      console.error('Local disk write failed:', err);
      throw new BadRequestException(
        `Gagal menyimpan berkas lokal: ${err.message}`,
      );
    }

    const host = process.env.BACKEND_URL || 'http://localhost:4000';
    return {
      success: true,
      url: `${host}/uploads/${filename}`,
      filename: filename,
    };
  }
}
