import { query } from '@/lib/db';
import ContactForm from '@/components/ContactForm';

export default async function Home() {
  let settings = {};
  let sectionsMap = {};
  let cmsContent = [];

  try {
    const settingsRows = await query.all("SELECT * FROM settings");
    settingsRows.forEach(row => { settings[row.key] = row.value; });

    const sectionsRows = await query.all("SELECT * FROM sections");
    sectionsRows.forEach(row => {
      sectionsMap[row.key] = { title: row.title, subtitle: row.subtitle, isActive: row.is_active === 1 };
    });

    cmsContent = await query.all("SELECT * FROM cms_content ORDER BY order_index ASC");
  } catch (error) {
    console.error("Failed to load home page content:", error);
  }

  const getContentForSection = (sectionName) => cmsContent.filter(item => item.section === sectionName);
  const isSectionActive = (key) => sectionsMap[key]?.isActive ?? false;
  
  const getSectionHeader = (key, defaultTitle, defaultSubtitle) => ({
    title: sectionsMap[key]?.title || defaultTitle,
    subtitle: sectionsMap[key]?.subtitle || defaultSubtitle
  });

  // Helper function to split titles into two parts for two-tone typography
  const splitTitle = (title, fallbackTitle = '') => {
    const t = title || fallbackTitle;
    if (!t) return { part1: '', part2: '' };
    const words = t.trim().split(/\s+/);
    if (words.length <= 1) return { part1: t, part2: '' };
    const part2 = words.pop();
    const part1 = words.join(' ');
    return { part1, part2 };
  };

  // Indonesian date formatter
  const getIndonesianDate = () => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const heroTagline     = settings.hero_tagline       || settings.seo_description || '';
  const heroImage       = settings.hero_image         || null;
  const aboutImage      = settings.about_image        || null;
  const visionImage     = settings.vision_image       || null;
  const missionImage    = settings.mission_image      || null;

  // Contact panel texts from settings
  const contactPanelTitle = settings.contact_panel_title || 'Mari Berkolaborasi';
  const contactPanelText  = settings.contact_panel_text  || 'Silakan isi formulir atau hubungi kami langsung via detail kontak di bawah ini.';

  return (
    <>
      {/* Scroll-reveal script injected once */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
              if (e.isIntersecting) {
                e.target.classList.add('revealed');
                io.unobserve(e.target);
              }
            });
          }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
          document.querySelectorAll('.reveal').forEach(el => io.observe(el));
          window.__revealObserver = io;
        })();
      `}} />

      {/* 1. Hero Section */}
      {isSectionActive('hero') && (() => {
        const header = getSectionHeader('hero', 'Empowering Business, Accelerating Growth Together', '');
        const heroTitleMain = settings.hero_title_main || "Company Profile";
        const splitHero = splitTitle(heroTitleMain);
        
        return (
          <section id="hero" className="editorial-hero">
            <div className="hero-left reveal">
              <h1 className="hero-giant-title">
                {splitHero.part1} <br />
                <span className="accent-color">{splitHero.part2}</span>
              </h1>
              <div className="hero-date">{getIndonesianDate()}</div>
            </div>

            <div className="hero-center reveal" style={{ animationDelay: '0.1s' }}>
              {heroImage ? (
                <div className="hero-bg-container">
                  <img src={heroImage} alt={settings.company_name || "Company Profile Visual"} />
                </div>
              ) : (
                <div className="hero-bg-container default-bg">
                  <div className="abstract-pattern" />
                </div>
              )}
            </div>

            <div className="hero-right reveal" style={{ animationDelay: '0.2s' }}>
              <div className="hero-tagline-box">
                <div className="line-top" />
                <p className="hero-tagline-text">{header.title}</p>
                <div className="line-bottom" />
              </div>
              
              <div className="hero-bottom-info">
                <a href="#about" className="hero-next-arrow" aria-label="Next Section">
                  <span className="arrow-icon">→</span>
                </a>
                <div className="hero-presentation">
                  Presented by <strong>{settings.company_name || 'PT BINA OPTIMA MAKSIMA'}</strong>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* 2. About Section */}
      {isSectionActive('about') && (() => {
        const header = getSectionHeader('about', 'About Us', '');
        const splitAbout = splitTitle(header.title, 'About Us');
        const aboutText = header.subtitle || settings.seo_description || '';
        
        return (
          <section id="about" className="editorial-about">
            <div className="about-left reveal">
              <div className="about-image-box">
                {aboutImage ? (
                  <img src={aboutImage} alt="About Team" />
                ) : (
                  <div className="about-image-placeholder" style={{ background: 'linear-gradient(135deg, var(--primary-glow), var(--secondary-color))' }}>
                    <span style={{ fontSize: '4rem' }}>🏢</span>
                  </div>
                )}
              </div>
            </div>

            <div className="about-right reveal" style={{ animationDelay: '0.1s' }}>
              <div className="about-content-box">
                <div className="about-box-header">
                  <h3>Who We Are</h3>
                  <a href="#vision" className="box-arrow">→</a>
                </div>
                <div className="about-box-line" />
                <p className="about-box-text">{aboutText}</p>
              </div>

              <h2 className="about-giant-title">
                {splitAbout.part1} <span className="accent-color">{splitAbout.part2}</span>
              </h2>
            </div>
          </section>
        );
      })()}

      {/* 3. Vision Section */}
      {isSectionActive('vision') && getContentForSection('vision').length > 0 && (() => {
        const header = getSectionHeader('vision', 'Our Vision', '');
        const splitVision = splitTitle(header.title, 'Our Vision');
        const visionItems = getContentForSection('vision');

        return (
          <section id="vision" className="editorial-vision">
            <div className="vision-left reveal">
              <h2 className="vision-giant-title">
                {splitVision.part1} <br />
                <span className="accent-color">{splitVision.part2}</span>
              </h2>
            </div>

            <div className="vision-middle reveal" style={{ animationDelay: '0.1s' }}>
              <div className="vision-cards">
                {visionItems.map((item) => (
                  <div key={item.id} className="vision-card">
                    <div className="vision-card-header">
                      {item.title}
                    </div>
                    {item.subtitle && <div className="vision-card-subtitle">{item.subtitle}</div>}
                    <div className="vision-card-line" />
                    <p className="vision-card-content">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="vision-right reveal" style={{ animationDelay: '0.2s' }}>
              <div className="vision-desc-box">
                <p>{header.subtitle}</p>
                <a href="#mission" className="vision-arrow" style={{ textDecoration: 'none' }}>→</a>
              </div>
              <div className="vision-image-box">
                {visionImage ? (
                  <img src={visionImage} alt="Our Vision" />
                ) : (
                  <div className="vision-image-placeholder" style={{ background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-glow))' }}>
                    <span style={{ fontSize: '3rem' }}>📸</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })()}

      {/* 4. Mission Section */}
      {isSectionActive('mission') && getContentForSection('mission').length > 0 && (() => {
        const header = getSectionHeader('mission', 'Our Mission', '');
        const splitMission = splitTitle(header.title, 'Our Mission');
        const missionItems = getContentForSection('mission');

        return (
          <section id="mission" className="editorial-mission">
            <div className="mission-left reveal">
              <div className="mission-image-box">
                {missionImage ? (
                  <img src={missionImage} alt="Our Mission" />
                ) : (
                  <div className="mission-image-placeholder" style={{ background: 'linear-gradient(135deg, var(--primary-glow), var(--secondary-color))' }}>
                    <span style={{ fontSize: '3rem' }}>🤝</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mission-right reveal" style={{ animationDelay: '0.1s' }}>
              <h2 className="mission-giant-title">
                {splitMission.part1} <span className="accent-color">{splitMission.part2}</span>
              </h2>
              <p className="mission-subtitle">{header.subtitle}</p>
              <div className="mission-title-line" />

              <div className="mission-row">
                {missionItems.map((item, idx) => {
                  const isWhiteCard = idx === 1;
                  return (
                    <div key={item.id} className={`mission-card ${isWhiteCard ? 'card-white' : 'card-gray'}`}>
                      <h4 className="mission-card-title">{item.title}</h4>
                      {item.subtitle && <h5 className="mission-card-subtitle">{item.subtitle}</h5>}
                      <p className="mission-card-content">{item.content}</p>
                      {!isWhiteCard && <span className="mission-card-arrow">→</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* 5. Services Section */}
      {isSectionActive('services') && getContentForSection('services').length > 0 && (() => {
        const header = getSectionHeader('services', 'Our Services', 'Solusi bisnis komprehensif dari hulu ke hilir.');
        const splitServices = splitTitle(header.title, 'Our Services');
        const services = getContentForSection('services');
        
        return (
          <section id="services" className="editorial-services">
            <div className="services-left reveal">
              <h2 className="services-giant-title">
                {splitServices.part1} <br />
                <span className="accent-color">{splitServices.part2}</span>
              </h2>
              <p className="services-intro-text">{header.subtitle}</p>
              <div className="services-title-line" />
            </div>

            <div className="services-right reveal" style={{ animationDelay: '0.1s' }}>
              <div className="services-grid">
                {services.map((service, i) => (
                  <div className="service-editorial-card" key={service.id}>
                    <div className="service-card-icon">
                      {service.image_url && (service.image_url.startsWith('/') || service.image_url.startsWith('http')) ? (
                        <img src={service.image_url} alt={service.title} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                      ) : (service.image_url || '⚡')}
                    </div>
                    <h3 className="service-card-title">{service.title}</h3>
                    {service.subtitle && <h4 className="service-card-subtitle">{service.subtitle}</h4>}
                    <div className="service-card-line" />
                    <p className="service-card-text">{service.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* 6. Portfolio Section */}
      {isSectionActive('portfolio') && getContentForSection('portfolio').length > 0 && (() => {
        const header = getSectionHeader('portfolio', 'Selected Portfolio', 'Beberapa proyek unggulan yang telah kami selesaikan.');
        const splitPortfolio = splitTitle(header.title, 'Selected Portfolio');
        const portfolios = getContentForSection('portfolio');
        
        return (
          <section id="portfolio" className="editorial-portfolio">
            <div className="portfolio-header reveal">
              <h2 className="portfolio-giant-title">
                {splitPortfolio.part1} <span className="accent-color">{splitPortfolio.part2}</span>
              </h2>
              <p className="portfolio-intro-text">{header.subtitle}</p>
            </div>

            <div className="portfolio-grid reveal" style={{ animationDelay: '0.1s' }}>
              {portfolios.map((item) => (
                <div className="portfolio-editorial-card" key={item.id}>
                  <div className="portfolio-card-img">
                    {item.image_url && (item.image_url.startsWith('/') || item.image_url.startsWith('http')) ? (
                      <img src={item.image_url} alt={item.title} />
                    ) : (
                      <div className="portfolio-placeholder" style={{ background: 'linear-gradient(135deg, var(--primary-glow), var(--secondary-color))' }}>
                        <span>📂</span>
                      </div>
                    )}
                  </div>
                  <div className="portfolio-card-info">
                    <span className="portfolio-card-tag">{item.subtitle}</span>
                    <h3 className="portfolio-card-title">{item.title}</h3>
                    <p className="portfolio-card-text">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* 7. Testimonials Section */}
      {isSectionActive('testimonials') && getContentForSection('testimonials').length > 0 && (() => {
        const header = getSectionHeader('testimonials', 'Client Feedback', 'Ulasan jujur dari mitra kerja dan klien kami.');
        const splitTestimonials = splitTitle(header.title, 'Client Feedback');
        const testimonials = getContentForSection('testimonials');
        
        return (
          <section id="testimonials" className="editorial-testimonials">
            <div className="testimonials-left reveal">
              <h2 className="testimonials-giant-title">
                {splitTestimonials.part1} <br />
                <span className="accent-color">{splitTestimonials.part2}</span>
              </h2>
              <p className="testimonials-intro-text">{header.subtitle}</p>
            </div>

            <div className="testimonials-right reveal" style={{ animationDelay: '0.1s' }}>
              <div className="testimonials-list">
                {testimonials.map((t) => (
                  <div className="testimonial-editorial-box" key={t.id}>
                    <p className="testimonial-quote">"{t.content}"</p>
                    <div className="testimonial-footer-line" />
                    <div className="testimonial-meta">
                      {t.image_url && (t.image_url.startsWith('/') || t.image_url.startsWith('http')) && (
                        <img src={t.image_url} alt={t.title} className="testimonial-avatar" />
                      )}
                      <div>
                        <h4>{t.title}</h4>
                        <span>{t.subtitle}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* 8. Our Team Section */}
      {isSectionActive('team') && getContentForSection('team').length > 0 && (() => {
        const header = getSectionHeader('team', 'Meet Our Team', 'Jajaran manajemen profesional yang berdedikasi.');
        const splitTeam = splitTitle(header.title, 'Meet Our Team');
        const members = getContentForSection('team');

        return (
          <section id="team" className="editorial-team">
            <div className="team-left reveal">
              <div className="team-intro">
                <h2 className="team-giant-title">
                  {splitTeam.part1} <br />
                  <span className="accent-color">{splitTeam.part2}</span>
                </h2>
                <div className="team-title-arrow">→</div>
                <div className="team-line" />
                <p className="team-intro-text">{header.subtitle}</p>
                <div className="team-line" />
              </div>
            </div>

            <div className="team-right reveal" style={{ animationDelay: '0.1s' }}>
              <div className="team-members-row">
                {members.map((member) => (
                  <div key={member.id} className="team-member-card">
                    <div className="team-member-photo">
                      {member.image_url && (member.image_url.startsWith('/') || member.image_url.startsWith('http')) ? (
                        <img src={member.image_url} alt={member.title} />
                      ) : (
                        <div className="team-member-avatar-placeholder">
                          <span>{member.image_url || '👤'}</span>
                        </div>
                      )}
                    </div>
                    <div className="team-member-info">
                      <h3 className="team-member-name">{member.title}</h3>
                      <p className="team-member-role">{member.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* 9. Contact Section */}
      {isSectionActive('contact') && (() => {
        const header = getSectionHeader('contact', 'Get In Touch', 'Let\'s collaborate on your next big project.');
        const splitContact = splitTitle(header.title, 'Get In Touch');
        
        return (
          <section id="contact" className="editorial-contact">
            <div className="contact-left reveal">
              <h2 className="contact-giant-title">
                {splitContact.part1} <span className="accent-color">{splitContact.part2}</span>
              </h2>
              
              <div className="contact-editorial-info">
                <h3>{contactPanelTitle}</h3>
                <p>{contactPanelText}</p>
                
                <div className="contact-editorial-list">
                  {settings.email && (
                    <div className="contact-editorial-item">
                      <span className="icon">📧</span>
                      <div>
                        <h4>Email</h4>
                        <p>{settings.email}</p>
                      </div>
                    </div>
                  )}
                  {settings.whatsapp && (
                    <div className="contact-editorial-item">
                      <span className="icon">💬</span>
                      <div>
                        <h4>WhatsApp</h4>
                        <p>{settings.whatsapp}</p>
                      </div>
                    </div>
                  )}
                  {settings.address && (
                    <div className="contact-editorial-item">
                      <span className="icon">📍</span>
                      <div>
                        <h4>Alamat</h4>
                        <p>{settings.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="contact-right reveal" style={{ animationDelay: '0.1s' }}>
              <div className="contact-form-editorial-box">
                <ContactForm />
              </div>
            </div>
          </section>
        );
      })()}
    </>
  );
}
