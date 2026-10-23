import { execSync } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL;

if (dbUrl && !dbUrl.includes('localhost') && !dbUrl.includes('127.0.0.1')) {
  console.log('🔄 Remote database detected, pushing schema and running seeds...');
  try {
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
    console.log('✓ Database schema synchronized successfully!');
    
    execSync('node prisma/seed-remote.cjs', { stdio: 'inherit' });
    console.log('✓ Remote database seeded successfully!');
  } catch (err) {
    console.warn('⚠️ db-sync warning:', err.message);
  }
} else {
  console.log('ℹ️ Local environment or no remote DATABASE_URL, skipping remote db push.');
}
