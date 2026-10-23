const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const query = {
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
};

async function migrate() {
  try {
    console.log('Running migration...');

    // 1. Add 'vision' and 'mission' sections
    const defaultSections = [
      { key: 'vision', title: 'Our Vision', subtitle: 'Menjadi perusahaan penyedia solusi bisnis terintegrasi dan mitra strategis utama yang mendorong pertumbuhan berkelanjutan serta daya saing global bagi seluruh pemangku kepentingan.', is_active: 1 },
      { key: 'mission', title: 'Our Mission', subtitle: 'Let us achieve our great mission together.', is_active: 1 }
    ];

    for (const s of defaultSections) {
      const exists = await query.get('SELECT * FROM sections WHERE key = ?', [s.key]);
      if (!exists) {
        await query.run('INSERT INTO sections (key, title, subtitle, is_active) VALUES (?, ?, ?, ?)', [s.key, s.title, s.subtitle, s.is_active]);
        console.log(`Inserted section: ${s.key}`);
      } else {
        console.log(`Section ${s.key} already exists`);
      }
    }

    // 2. Add cms_content for 'vision' and 'mission'
    const defaultContents = [
      {
        section: 'vision',
        title: 'Vision 1',
        subtitle: 'Business Transformation',
        image_url: '',
        content: 'Business Transformation: Menjadi motor penggerak transformasi bisnis terdepan yang adaptif dan inovatif.',
        order_index: 1
      },
      {
        section: 'vision',
        title: 'Vision 2',
        subtitle: 'Trusted Ecosystem',
        image_url: '',
        content: 'Trusted Ecosystem: Menciptakan ekosistem usaha yang terpercaya dan berdaya saing global.',
        order_index: 2
      },
      {
        section: 'mission',
        title: 'Mission 1',
        subtitle: '',
        image_url: '',
        content: 'Membangun Ekosistem yang Berintegritas: Menciptakan jaringan bisnis yang inklusif dan transparan melalui kolaborasi strategis guna menghasilkan nilai tambah jangka panjang.',
        order_index: 1
      },
      {
        section: 'mission',
        title: 'Mission 2',
        subtitle: '',
        image_url: '',
        content: 'Transformasi Digital Berkelanjutan: Mengoptimalkan pemanfaatan teknologi modern untuk meningkatkan efektivitas kerja, akurasi, dan nilai kompetitif di setiap lini layanan.',
        order_index: 2
      },
      {
        section: 'mission',
        title: 'Mission 3',
        subtitle: '',
        image_url: '',
        content: 'Menciptakan Nilai Jangka Panjang: Membangun ekosistem kemitraan yang inklusif dan berintegritas demi memberikan nilai tambah yang berkelanjutan bagi masyarakat dan dunia usaha.',
        order_index: 3
      }
    ];

    for (const c of defaultContents) {
      const exists = await query.get('SELECT * FROM cms_content WHERE section = ? AND title = ?', [c.section, c.title]);
      if (!exists) {
        await query.run('INSERT INTO cms_content (section, title, subtitle, image_url, content, order_index) VALUES (?, ?, ?, ?, ?, ?)', [c.section, c.title, c.subtitle, c.image_url, c.content, c.order_index]);
        console.log(`Inserted CMS content for: ${c.section} -> ${c.title}`);
      } else {
        console.log(`CMS content for ${c.section} -> ${c.title} already exists`);
      }
    }

    console.log('Migration complete!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    db.close();
  }
}

migrate();
