import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
// @ts-ignore
import { AppModule } from '../dist/app.module.js';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync } from 'fs';
import { json, urlencoded } from 'express';

let cachedServer: any;

async function bootstrapServer() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));
  const uploadsDir = join(process.cwd(), 'uploads');
  if (existsSync(uploadsDir)) {
    app.useStaticAssets(uploadsDir, {
      prefix: '/uploads/',
    });
  }
  await app.init();
  return app.getHttpAdapter().getInstance();
}

export default async function handler(req: any, res: any) {
  try {
    if (!cachedServer) {
      cachedServer = await bootstrapServer();
    }
    return cachedServer(req, res);
  } catch (err: any) {
    console.error('SERVERLESS_BOOTSTRAP_ERROR:', err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    return res.status(500).json({
      error: 'SERVERLESS_BOOTSTRAP_ERROR',
      message: err?.message || String(err),
      stack: err?.stack,
    });
  }
}


