'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header({ settings, navigation }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync theme with system and localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const companyName = settings.company_name || 'Company Name';

  // Pick the right logo based on theme
  const logoUrl = theme === 'dark'
    ? (settings.logo_dark || settings.logo_light || null)
    : (settings.logo_light || settings.logo_dark || null);

  return (
    <header className={`${scrolled ? 'scrolled' : ''} glass-panel`}>
      {/* Brand logo / text */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={companyName}
            style={{
              height: '40px',
              maxWidth: '160px',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        ) : (
          <span style={{ 
            fontSize: '1.5rem', 
            fontWeight: '800', 
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>
            {companyName}
          </span>
        )}
      </Link>

      {/* Navigation */}
      <nav className={mobileMenuOpen ? 'open' : ''}>
        <ul>
          {navigation.map(item => (
            <li key={item.id}>
              <a 
                href={item.url} 
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
          {/* Portal Admin is intentionally hidden from public navigation.
              Admin can access the panel directly at /admin */}
        </ul>
      </nav>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme} 
          aria-label="Toggle Theme"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-dark)',
            transition: 'var(--transition-smooth)'
          }}
          className="theme-toggler"
        >
          <span style={{ color: 'var(--primary-color)' }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </span>
        </button>

        {/* Mobile Hamburger Menu Toggle */}
        <button 
          className="nav-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </header>
  );
}
