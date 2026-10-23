import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const dbFile = process.env.DB_DATABASE || 'database.sqlite';
const dbPath = path.resolve(process.cwd(), dbFile);

// Check if database file already exists before opening connection
// (Helps prevent concurrent migration runs in Next.js static build workers)
const dbExistsBeforeInit = fs.existsSync(dbPath);

// Initialize sqlite3 database connection
const db = new sqlite3.Database(dbPath);

// Promisified DB helpers
export const query = {
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
  },
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  exec(sql) {
    return new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};

// Automated Migrations & Seeders
export async function initDatabase() {
  try {
    // 1. Create Users Table
    await query.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);

    // 2. Create Settings Table
    await query.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);

    // 3. Create Navigation Table (added UNIQUE constraint on label to prevent duplicates)
    await query.exec(`
      CREATE TABLE IF NOT EXISTS navigation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT UNIQUE NOT NULL,
        url TEXT NOT NULL,
        order_index INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1
      )
    `);

    // 4. Create Sections Table
    await query.exec(`
      CREATE TABLE IF NOT EXISTS sections (
        key TEXT PRIMARY KEY,
        title TEXT,
        subtitle TEXT,
        is_active INTEGER DEFAULT 1
      )
    `);

    // 5. Create CMS Content Table (added UNIQUE constraint on section + title to prevent duplicates)
    await query.exec(`
      CREATE TABLE IF NOT EXISTS cms_content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section TEXT NOT NULL,
        title TEXT NOT NULL,
        subtitle TEXT,
        image_url TEXT,
        content TEXT,
        order_index INTEGER DEFAULT 0,
        UNIQUE(section, title)
      )
    `);

    // 6. Create Contact Submissions Table
    await query.exec(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed default admin user (using INSERT OR IGNORE for concurrency safety)
    const adminExists = await query.get("SELECT * FROM users WHERE email = ?", ['admin@mail.com']);
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await query.run("INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)", ['admin@mail.com', hashedPassword]);
      console.log('Seeded default admin user (admin@mail.com / password123)');
    }

    // Seed settings (using INSERT OR REPLACE)
    const settingsCount = await query.get("SELECT COUNT(*) as count FROM settings");
    if (settingsCount.count === 0) {
      const defaultSettings = {
        company_name: "Antigravity Solutions",
        logo_light: "",
        logo_dark: "",
        favicon: "",
        email: "hello@antigravity.co",
        whatsapp: "+6281234567890",
        address: "Sudirman Central Business District, Jakarta, Indonesia",
        social_facebook: "https://facebook.com",
        social_instagram: "https://instagram.com",
        social_twitter: "https://twitter.com",
        social_linkedin: "https://linkedin.com",
        primary_color: process.env.DEFAULT_PRIMARY_COLOR || "#4f46e5",
        secondary_color: process.env.DEFAULT_SECONDARY_COLOR || "#0f172a",
        font_family: process.env.DEFAULT_FONT_FAMILY || "Inter",
        seo_title: "Antigravity Solutions - Scalable Tech Partner",
        seo_description: "We build modern software, websites, and high-performance digital products for your business.",
        seo_keywords: "company profile, tech solutions, web development, custom software, next.js"
      };

      for (const [key, value] of Object.entries(defaultSettings)) {
        await query.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, value]);
      }
      console.log('Seeded default global settings');
    }

    // Seed sections (using INSERT OR IGNORE)
    const sectionsCount = await query.get("SELECT COUNT(*) as count FROM sections");
    if (sectionsCount.count === 0) {
      const defaultSections = [
        { key: 'hero', title: 'Empowering Businesses through Code', subtitle: 'We design and craft premium scalable software systems.', is_active: 1 },
        { key: 'about', title: 'About Our Company', subtitle: 'Who we are and what drives us forward.', is_active: 1 },
        { key: 'services', title: 'Our Services', subtitle: 'Tailored services built with state-of-the-art tech.', is_active: 1 },
        { key: 'portfolio', title: 'Selected Projects', subtitle: 'Browse our latest successful developments.', is_active: 1 },
        { key: 'testimonials', title: 'Client Feedback', subtitle: 'What our clients say about partnering with us.', is_active: 1 },
        { key: 'team', title: 'Our Team', subtitle: 'Meet the talented people behind our success.', is_active: 1 },
        { key: 'contact', title: 'Get In Touch', subtitle: 'Let\'s collaborate on your next big project.', is_active: 1 },
      ];

      for (const s of defaultSections) {
        await query.run("INSERT OR IGNORE INTO sections (key, title, subtitle, is_active) VALUES (?, ?, ?, ?)", [s.key, s.title, s.subtitle, s.is_active]);
      }
      console.log('Seeded default sections configuration');
    }

    // Seed navigation (using INSERT OR IGNORE)
    const navCount = await query.get("SELECT COUNT(*) as count FROM navigation");
    if (navCount.count === 0) {
      const defaultNavs = [
        { label: 'Home', url: '#hero', order_index: 1 },
        { label: 'About', url: '#about', order_index: 2 },
        { label: 'Services', url: '#services', order_index: 3 },
        { label: 'Portfolio', url: '#portfolio', order_index: 4 },
        { label: 'Testimonials', url: '#testimonials', order_index: 5 },
        { label: 'Contact', url: '#contact', order_index: 6 },
      ];

      for (const n of defaultNavs) {
        await query.run("INSERT OR IGNORE INTO navigation (label, url, order_index, is_active) VALUES (?, ?, ?, 1)", [n.label, n.url, n.order_index]);
      }
      console.log('Seeded default navigation menus');
    }

    // Seed CMS content (using INSERT OR IGNORE)
    const contentCount = await query.get("SELECT COUNT(*) as count FROM cms_content");
    if (contentCount.count === 0) {
      const defaultContents = [
        // About Section Detail
        {
          section: 'about',
          title: 'Innovation is in our DNA',
          subtitle: 'Founded with a vision to streamline digital transformation.',
          image_url: '',
          content: 'We are a dedicated team of engineers, designers, and strategists. We partner with companies of all sizes to design, build, and deploy robust web applications and digital platforms. Our methodology relies on transparency, agile delivery, and extreme attention to visual and structural details.',
          order_index: 1
        },
        // Services
        {
          section: 'services',
          title: 'Web Application Development',
          subtitle: 'Next.js, React, Node.js & Cloud Architecture',
          image_url: '💻',
          content: 'High-performance, search-engine-optimized, responsive web applications built with the latest tools and hosted on top cloud architectures.',
          order_index: 1
        },
        {
          section: 'services',
          title: 'Mobile App Development',
          subtitle: 'iOS & Android Native Experience',
          image_url: '📱',
          content: 'Smooth cross-platform mobile apps built with React Native or Flutter, ensuring high frame rates and native UI styling.',
          order_index: 2
        },
        {
          section: 'services',
          title: 'UI/UX Design Systems',
          subtitle: 'Vibrant Colors, Premium Interactions',
          image_url: '🎨',
          content: 'Bespoke design kits, interactive mockups, and highly polished visual guidelines designed to wow users and drive engagement.',
          order_index: 3
        },
        // Portfolio Items
        {
          section: 'portfolio',
          title: 'Apex E-Commerce Ecosystem',
          subtitle: 'E-Commerce Platform',
          image_url: '',
          content: 'A massive scale storefront supporting 50,000+ daily concurrent users, complete with real-time stock notifications and seamless checkout flows.',
          order_index: 1
        },
        {
          section: 'portfolio',
          title: 'Vanguard Analytics Dashboard',
          subtitle: 'SaaS Platform',
          image_url: '',
          content: 'Interactive business intelligence tool offering deep-dive data visualization, real-time telemetry pipelines, and customized scheduled reports.',
          order_index: 2
        },
        // Testimonials
        {
          section: 'testimonials',
          title: 'Sarah Jenkins',
          subtitle: 'CTO, Apex Retail Group',
          image_url: '',
          content: 'Antigravity transformed our old laggy e-commerce setup into an incredibly fast, highly scalable React architecture. Our sales conversion increased by 27% within the first month. Highly recommended partners!',
          order_index: 1
        },
        {
          section: 'testimonials',
          title: 'Marcus Vance',
          subtitle: 'Product VP, Vanguard SaaS',
          image_url: '',
          content: 'Working with this team was seamless. They delivered the dynamic analytics charts and custom widgets on time. Their design aesthetics are modern and premium.',
          order_index: 2
        },
        // Team Members
        {
          section: 'team',
          title: 'Alex Rivera',
          subtitle: 'CEO & Co-Founder',
          image_url: '👨‍💼',
          content: 'Visionary leader with 12+ years in enterprise software. Alex drives the company strategy and client relationships with a passion for innovation.',
          order_index: 1
        },
        {
          section: 'team',
          title: 'Priya Sharma',
          subtitle: 'Lead Engineer',
          image_url: '👩‍💻',
          content: 'Full-stack architect specializing in React and Node.js. Priya leads our engineering guild and ensures every codebase is clean, tested, and scalable.',
          order_index: 2
        },
        {
          section: 'team',
          title: 'Jordan Kim',
          subtitle: 'Head of Design',
          image_url: '🎨',
          content: 'Award-winning UI/UX designer with a sharp eye for detail. Jordan crafts experiences that are both beautiful and conversion-focused.',
          order_index: 3
        }
      ];

      for (const c of defaultContents) {
        await query.run("INSERT OR IGNORE INTO cms_content (section, title, subtitle, image_url, content, order_index) VALUES (?, ?, ?, ?, ?, ?)", [
          c.section, c.title, c.subtitle, c.image_url, c.content, c.order_index
        ]);
      }
      console.log('Seeded default CMS content (About, Services, Portfolio, Testimonials)');
    }

    console.log('Database initialized successfully.');
  } catch (error) {
    // Suppress constraint errors from concurrent runs
    if (error.code !== 'SQLITE_CONSTRAINT') {
      console.error('Error during database initialization:', error);
    }
  }
}

// Only trigger migration/seeding if database didn't exist prior to process starting,
// which prevents concurrent Next.js workers from triggering multiple seed runs.
if (!dbExistsBeforeInit) {
  initDatabase();
}
