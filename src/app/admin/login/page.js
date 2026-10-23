'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Apply dark mode styling to login page
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      // Keep dark mode settings consistent
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme !== 'dark') {
        document.documentElement.classList.remove('dark');
      }
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.message || 'Login gagal. Periksa kembali email dan password Anda.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 150px)',
      background: 'var(--bg-dark)',
      padding: '2rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '3rem 2rem',
        borderRadius: 'var(--border-radius-md)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        animation: 'fadeInUp 0.6s ease-out'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '3rem' }}>🔒</span>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '800', 
            marginTop: '1rem',
            background: 'linear-gradient(135deg, var(--text-light), var(--primary-color))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Portal Admin
          </h2>
          <p style={{ color: 'var(--text-muted-light)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Masuk untuk mengelola website
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label htmlFor="email" style={{ color: 'var(--text-light)' }}>Email Address</label>
            <input 
              type="email" 
              id="email" 
              className="form-control" 
              placeholder="admin@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" style={{ color: 'var(--text-light)' }}>Password</label>
            <input 
              type="password" 
              id="password" 
              className="form-control" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={loading}
            />
          </div>

          {error && (
            <div className="form-status error" style={{ margin: '0' }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? 'Mengautentikasi...' : 'Masuk Dashboard'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', opacity: 0.5 }}>
          <p>Default: admin@mail.com / password123</p>
        </div>
      </div>
    </div>
  );
}
