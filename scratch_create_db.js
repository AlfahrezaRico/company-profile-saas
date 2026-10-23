const { Client } = require('pg');

async function main() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  });

  await client.connect();
  const res = await client.query("SELECT 1 FROM pg_database WHERE datname='company_profile'");
  if (res.rowCount === 0) {
    await client.query('CREATE DATABASE company_profile');
    console.log('✓ Database company_profile berhasil dibuat!');
  } else {
    console.log('✓ Database company_profile sudah ada!');
  }
  await client.end();
}

main().catch(console.error);
