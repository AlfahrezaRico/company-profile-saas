import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type');

    if (!file || !type) {
      return NextResponse.json({ success: false, message: 'File dan type harus disertakan.' }, { status: 400 });
    }

    // Settings types get saved to the settings table
    const settingsTypes = ['logo_light', 'logo_dark', 'favicon', 'hero_icon', 'hero_image', 'about_image', 'vision_image', 'mission_image'];
    // Content types just return the URL (caller saves to their own field)
    const contentTypes = ['content', 'team'];
    const allowedTypes = [...settingsTypes, ...contentTypes];

    if (!allowedTypes.includes(type)) {
      return NextResponse.json({ success: false, message: 'Tipe upload tidak valid.' }, { status: 400 });
    }

    // Validate MIME type
    const allowedMimes = [
      'image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml',
      'image/gif', 'image/webp', 'image/x-icon', 'image/vnd.microsoft.icon'
    ];
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json({ success: false, message: 'Format tidak didukung. Gunakan PNG, JPG, SVG, WEBP, atau ICO.' }, { status: 400 });
    }

    // Max 5MB for content images, 2MB for logos
    const MAX_SIZE = contentTypes.includes(type) ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      const limit = contentTypes.includes(type) ? '5MB' : '2MB';
      return NextResponse.json({ success: false, message: `Ukuran file maksimal ${limit}.` }, { status: 400 });
    }

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Unique filename
    const ext = file.name.split('.').pop().toLowerCase();
    const filename = `${type}-${Date.now()}.${ext}`;
    const filePath = path.join(uploadDir, filename);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    const publicUrl = `/uploads/${filename}`;

    // Only persist to settings table for logo/favicon types
    if (settingsTypes.includes(type)) {
      await query.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [type, publicUrl]);
    }

    return NextResponse.json({ success: true, url: publicUrl, message: 'Upload berhasil.' });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengupload file.' }, { status: 500 });
  }
}
