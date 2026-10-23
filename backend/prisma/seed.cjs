const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function main() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'company_profile',
  });

  await client.connect();
  console.log('Seeding PostgreSQL database: company_profile...');

  // 1. Admin User
  const passwordHash = await bcrypt.hash('password123', 10);
  const userRes = await client.query(`
    INSERT INTO users (id, email, "passwordHash", name, role, "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), 'admin@nusantaratech.id', $1, 'Administrator Utama', 'SUPERADMIN', NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
    RETURNING id;
  `, [passwordHash]);
  const authorId = userRes.rows[0].id;

  // 2. Company Profile
  await client.query('DELETE FROM company_profiles;');
  await client.query(`
    INSERT INTO company_profiles (
      id, "companyName", tagline, "logoUrl", "faviconUrl", about, vision, mission, address, email, phone, whatsapp, linkedin, instagram, "updatedAt"
    ) VALUES (
      gen_random_uuid(),
      'PT Nusantara Tech Digital',
      'Enterprise Digital & Cloud Solutions',
      'https://api.dicebear.com/7.x/identicon/svg?seed=NusantaraTech',
      null,
      'PT Nusantara Tech Digital adalah perusahaan rekayasa perangkat lunak enterprise dan solusi transformasi digital terkemuka yang berbasis di Jakarta, Indonesia.',
      'Menjadi mitra teknologi nomor satu di Asia Tenggara dalam menciptakan ekosistem bisnis digital yang tangguh dan berkelanjutan.',
      'Menghadirkan solusi teknologi mutakhir dengan transparansi tinggi, keamanan berstandar internasional, serta layanan purna jual yang sigap 24/7.',
      'Menara Nusantara Lt. 24, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan, 12190',
      'halo@nusantaratech.id',
      '+62 (21) 5088-7890',
      '+62 812-3456-7890',
      'https://linkedin.com/company/nusantara-tech',
      'https://instagram.com/nusantaratech.id',
      NOW()
    );
  `);

  // 3. Products
  await client.query('DELETE FROM products;');
  await client.query(`
    INSERT INTO products (id, name, slug, description, "shortDesc", "isFeatured", status, "galleryUrls", "createdAt", "updatedAt")
    VALUES 
    (gen_random_uuid(), 'Enterprise Web & Cloud Solutions', 'enterprise-web-cloud', 'Pengembangan sistem web skala besar dengan arsitektur microservices, performa tinggi, dan skalabilitas tanpa batas.', 'Solusi arsitektur web & cloud enterprise', true, 'PUBLISHED', ARRAY[]::text[], NOW(), NOW()),
    (gen_random_uuid(), 'Cyber Security & Auditing', 'cyber-security-auditing', 'Perlindungan aset digital perusahaan, pengujian penetrasi (pen-test), serta kepatuhan standar keamanan data ISO/IEC.', 'Keamanan data dan audit penetrasi sistem', true, 'PUBLISHED', ARRAY[]::text[], NOW(), NOW()),
    (gen_random_uuid(), 'AI Integration & Data Analytics', 'ai-integration-data-analytics', 'Implementasi kecerdasan buatan, pemrosesan data real-time, dan dashboard analitik prediktif untuk keputusan bisnis presisi.', 'Otomasi cerdas berbasis AI dan visualisasi data', true, 'PUBLISHED', ARRAY[]::text[], NOW(), NOW()),
    (gen_random_uuid(), 'Digital Business Transformation', 'digital-business-transformation', 'Modernisasi operasional bisnis konvensional menjadi ekosistem digital otomatis yang hemat biaya dan efisien.', 'Digitalisasi proses bisnis dan sistem ERP terpadu', false, 'PUBLISHED', ARRAY[]::text[], NOW(), NOW());
  `);

  // 4. Articles
  await client.query('DELETE FROM articles;');
  await client.query(`
    INSERT INTO articles (id, title, slug, content, excerpt, status, "publishedAt", "authorId", "createdAt", "updatedAt")
    VALUES
    (gen_random_uuid(), 'Tren Arsitektur Microservices Modern Menggunakan Go dan NestJS di 2026', 'tren-arsitektur-microservices-2026', 'Pelajari bagaimana perusahaan teknologi terkemuka mengoptimalkan resource server hingga 40% dengan arsitektur terdistribusi...', 'Panduan praktis mengoptimalkan performa server enterprise.', 'PUBLISHED', NOW(), $1, NOW(), NOW()),
    (gen_random_uuid(), 'Pentingnya Standar Keamanan Data Pelanggan untuk Platform Fintech', 'standar-keamanan-fintech', 'Langkah-langkah esensial mengamankan data transaksi digital dari ancaman serangan siber yang kian canggih...', 'Kepatuhan ISO 27001 dan enkripsi end-to-end.', 'PUBLISHED', NOW(), $1, NOW(), NOW()),
    (gen_random_uuid(), 'Meningkatkan ROI Bisnis 2x Lipat Melalui Otomasi Workflow', 'meningkatkan-roi-otomasi-workflow', 'Studi kasus implementasi digitalisasi proses internal pada manufaktur dan logistik nasional...', 'Strategi otomasi efisiensi operasional.', 'PUBLISHED', NOW(), $1, NOW(), NOW());
  `, [authorId]);

  // 5. Clients
  await client.query('DELETE FROM clients;');
  await client.query(`
    INSERT INTO clients (id, "companyName", category, "websiteUrl", "isActive", "createdAt")
    VALUES
    (gen_random_uuid(), 'Bank Artha Prima', 'Perbankan & Finansial', 'https://bankarthaprima.example.com', true, NOW()),
    (gen_random_uuid(), 'Nusantara Logistik', 'Supply Chain & Transportasi', 'https://nusantaralogistik.example.com', true, NOW()),
    (gen_random_uuid(), 'Medika Sehat Mandiri', 'Kesehatan & Farmasi', 'https://medikasehat.example.com', true, NOW()),
    (gen_random_uuid(), 'Telko Global Indonesia', 'Telekomunikasi', 'https://telkoglobal.example.com', true, NOW());
  `);

  // 6. Inquiries
  await client.query('DELETE FROM inquiries;');
  await client.query(`
    INSERT INTO inquiries (id, "fullName", email, phone, service, message, status, "createdAt", "updatedAt")
    VALUES
    (gen_random_uuid(), 'Bambang Wijaya', 'bambang@mandirisentosa.com', '+62 812-9988-7711', 'Custom Software Development', 'Halo tim Nusantara Tech, kami berencana memperbarui sistem ERP kami dan membutuhkan audit serta pengembangan modul baru.', 'UNREAD', NOW(), NOW()),
    (gen_random_uuid(), 'Clarissa Putri', 'clarissa@fintechnusantara.id', '+62 811-2233-4455', 'Cyber Security & Auditing', 'Kami memerlukan uji penetrasi (pen-test) berkala untuk aplikasi fintech kami.', 'REPLIED', NOW(), NOW()),
    (gen_random_uuid(), 'Hendra Gunawan', 'hendra@logistikprima.co.id', '+62 813-7788-9900', 'Enterprise Web & Cloud Solutions', 'Apakah ada estimasi biaya untuk migrasi sistem on-premise kami ke Kubernetes AWS?', 'READ', NOW(), NOW());
  `);

  await client.end();
  console.log('✓ Database seeding selesai dengan sukses!');
}

main().catch(console.error);
