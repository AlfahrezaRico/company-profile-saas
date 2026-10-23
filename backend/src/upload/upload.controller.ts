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
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException(
              'Hanya berkas gambar (JPG, PNG, WebP, SVG, AVIF, GIF) yang diperbolehkan!',
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
    const ext = extname(file.originalname) || '.png';
    const filename = `upload-${uniqueSuffix}${ext}`;

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
        console.error('Vercel Blob upload failed, falling back to Data URL:', err);
      }
    }

    // 2. LOCAL DEV MODE: Try local ./uploads directory
    const uploadDir = join(process.cwd(), 'uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(join(uploadDir, filename), file.buffer);
      const host = process.env.BACKEND_URL || 'http://localhost:4000';
      return {
        success: true,
        url: `${host}/uploads/${filename}`,
        filename: filename,
      };
    } catch (err: any) {
      console.warn(
        'Disk upload unavailable (serverless read-only filesystem). Converting to Base64 Data URL:',
        err.message,
      );
      // 3. SERVERLESS FALLBACK: Base64 Data URL (stored directly in DB, works everywhere)
      const mime = file.mimetype || 'image/png';
      const base64Data = file.buffer.toString('base64');
      const dataUri = `data:${mime};base64,${base64Data}`;
      return {
        success: true,
        url: dataUri,
        filename: filename,
      };
    }
  }
}
