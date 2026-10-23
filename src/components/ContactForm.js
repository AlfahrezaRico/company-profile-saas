'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus({ success: true, text: data.message });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ success: false, text: data.message || 'Gagal mengirim pesan. Silakan coba lagi.' });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus({ success: false, text: 'Terjadi kesalahan jaringan. Silakan periksa koneksi Anda.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="contact-form glass-panel" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nama Lengkap</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          className="form-control" 
          placeholder="Nama Anda"
          value={formData.name}
          onChange={handleChange}
          required 
          disabled={submitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          className="form-control" 
          placeholder="nama@email.com"
          value={formData.email}
          onChange={handleChange}
          required 
          disabled={submitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="message">Pesan Anda</label>
        <textarea 
          id="message" 
          name="message" 
          className="form-control" 
          placeholder="Tulis pesan atau pertanyaan Anda di sini..."
          value={formData.message}
          onChange={handleChange}
          required 
          disabled={submitting}
        />
      </div>

      {status && (
        <div className={`form-status ${status.success ? 'success' : 'error'}`}>
          {status.text}
        </div>
      )}

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={submitting}
        style={{ width: '100%', marginTop: '0.5rem' }}
      >
        {submitting ? 'Mengirim...' : 'Kirim Pesan'}
      </button>
    </form>
  );
}
