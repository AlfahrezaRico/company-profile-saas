import './globals.css';
import { query } from '@/lib/db';
import Header from '@/components/Header';

const fontLinks = {
  'Inter': 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'Roboto': 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
  'Poppins': 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  'Montserrat': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap',
  'Playfair Display': 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap',
  'Lora': 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&display=swap'
};

export async function generateMetadata() {
  try {
    const settingsRows = await query.all("SELECT * FROM settings");
    const settings = {};
    settingsRows.forEach(row => {
      settings[row.key] = row.value;
    });

    return {
      title: settings.seo_title || "Company Profile Template",
      description: settings.seo_description || "Dynamic company profile site.",
      keywords: settings.seo_keywords || "company profile, nextjs",
    };
  } catch (error) {
    return {
      title: "Company Profile Template",
      description: "Scalable company profile engine.",
    };
  }
}

export default async function RootLayout({ children }) {
  // 1. Fetch settings from DB
  let settings = {};
  let navigation = [];
  try {
    const settingsRows = await query.all("SELECT * FROM settings");
    settingsRows.forEach(row => {
      settings[row.key] = row.value;
    });

    const sectionsRows = await query.all("SELECT * FROM sections");
    const sectionsMap = {};
    sectionsRows.forEach(row => {
      sectionsMap[row.key] = { is_active: row.is_active === 1 };
    });

    const cmsCounts = await query.all("SELECT section, COUNT(*) as count FROM cms_content GROUP BY section");
    const cmsCountsMap = {};
    cmsCounts.forEach(row => {
      cmsCountsMap[row.section] = row.count;
    });

    const defaultNavs = [
      { key: 'hero', label: 'Home', url: '#hero' },
      { key: 'about', label: 'About', url: '#about', requiresContent: true },
      { key: 'services', label: 'Services', url: '#services', requiresContent: true },
      { key: 'portfolio', label: 'Portfolio', url: '#portfolio', requiresContent: true },
      { key: 'testimonials', label: 'Testimonials', url: '#testimonials', requiresContent: true },
      { key: 'team', label: 'Our Team', url: '#team', requiresContent: true },
      { key: 'contact', label: 'Contact', url: '#contact' }
    ];

    navigation = defaultNavs
      .filter(item => {
        const sectionActive = sectionsMap[item.key]?.is_active;
        if (!sectionActive) return false;
        if (item.requiresContent && (!cmsCountsMap[item.key] || cmsCountsMap[item.key] === 0)) {
          return false;
        }
        return true;
      })
      .map((item, idx) => ({
        id: idx + 1,
        label: item.label,
        url: item.url
      }));
  } catch (error) {
    console.error("Failed to load settings in Layout:", error);
    // Fallbacks
    settings = {
      company_name: "Company Profile",
      primary_color: "#4f46e5",
      secondary_color: "#0f172a",
      font_family: "Inter"
    };
    navigation = [
      { id: 1, label: 'Home', url: '#hero' },
      { id: 2, label: 'About', url: '#about' }
    ];
  }

  const selectedFont = settings.font_family || 'Inter';
  const fontUrl = fontLinks[selectedFont] || fontLinks['Inter'];
  const fontCssName = selectedFont === 'Playfair Display' ? "'Playfair Display', serif" :
                       selectedFont === 'Lora' ? "'Lora', serif" : 
                       `'${selectedFont}', sans-serif`;

  return (
    <html lang="id">
      <head>
        {/* Dynamic Google Fonts Link */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontUrl} rel="stylesheet" />

        {/* Dynamic theme CSS variables injection */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary-color: ${settings.primary_color || '#4f46e5'};
            --secondary-color: ${settings.secondary_color || '#0f172a'};
            --primary-glow: rgba(${hexToRgb(settings.primary_color || '#4f46e5')}, 0.15);
            --font-family: ${fontCssName};
          }
        `}} />
      </head>
      <body>
        {/* Header Navigation */}
        <Header settings={settings} navigation={navigation} />

        {/* Dynamic Page Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-inner">
            <div className="social-links">
              {settings.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                </a>
              )}
              {settings.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}
              {settings.social_linkedin && (
                <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              )}
              {settings.social_twitter && (
                <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className="social-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}
            </div>
            <p>© {new Date().getFullYear()} {settings.company_name || 'Company'}. {settings.footer_copyright || 'All rights reserved.'}</p>
            {settings.footer_tagline && (
              <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.45 }}>{settings.footer_tagline}</p>
            )}
          </div>
        </footer>

        {/* Scroll-reveal activation — runs after HTML is parsed */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var els = document.querySelectorAll('.reveal');
            if (!els.length) return;
            var io = new IntersectionObserver(function(entries) {
              entries.forEach(function(e) {
                if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
              });
            }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
            els.forEach(function(el) { io.observe(el); });
          })();
        `}} />
      </body>
    </html>
  );
}

// Helper function to turn hex color to RGB string
function hexToRgb(hex) {
  // Remove '#' if present
  const cleaned = hex.replace(/^#/, '');
  // Parse shorthand
  let fullHex = cleaned;
  if (cleaned.length === 3) {
    fullHex = cleaned.split('').map(c => c + c).join('');
  }
  const num = parseInt(fullHex, 16);
  if (isNaN(num)) return '79, 70, 229'; // default fallback rgb
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r}, ${g}, ${b}`;
}
