'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ToastProvider, useToast, ConfirmDialog, TipButton } from './ui';

export default function AdminDashboard(props) {
  return (
    <ToastProvider>
      <AdminDashboardInner {...props} />
    </ToastProvider>
  );
}

function AdminDashboardInner({ 
  initialSettings, 
  initialSections, 
  initialNavigation, 
  initialCmsContent, 
  initialSubmissions 
}) {
  const router = useRouter();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('settings');
  const [settings, setSettings] = useState(initialSettings);
  const [sections, setSections] = useState(initialSections);
  const [navigation, setNavigation] = useState(initialNavigation);
  const [cmsContent, setCmsContent] = useState(initialCmsContent);
  const [submissions, setSubmissions] = useState(initialSubmissions);

  // Form states
  const [loading, setLoading] = useState(false);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', description: '', onConfirm: null });
  const openConfirm = (title, description, onConfirm) => {
    setConfirmDialog({ open: true, title, description, onConfirm });
  };
  const closeConfirm = () => setConfirmDialog(prev => ({ ...prev, open: false }));

  // CMS edit states
  const [editingContent, setEditingContent] = useState(null);
  const [cmsForm, setCmsForm] = useState({
    id: '', section: 'services', title: '', subtitle: '', image_url: '', content: '', order_index: 0
  });

  // Navigation edit states
  const [newNavItem, setNewNavItem] = useState({ label: '', url: '', is_active: 1 });

  // Password edit state
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  // Logo upload states
  const [uploadingLogo, setUploadingLogo] = useState(null);
  const logoLightRef = useRef(null);
  const logoDarkRef = useRef(null);
  const faviconRef = useRef(null);
  const heroIconRef = useRef(null);
  const heroImageRef = useRef(null);
  const aboutImageRef = useRef(null);
  const visionImageRef = useRef(null);
  const missionImageRef = useRef(null);

  // Content image upload states
  const [uploadingContent, setUploadingContent] = useState(false);
  const contentImageRef = useRef(null);

  // CMS active section filter
  const [cmsFilter, setCmsFilter] = useState('all');

  // Helper to show status message → now uses Radix Toast
  const showStatus = (success, text) => {
    toast?.(text, success ? 'success' : 'error');
  };

  // LOGO UPLOAD HANDLER
  const handleLogoUpload = async (file, type) => {
    if (!file) return;
    setUploadingLogo(type);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(prev => ({ ...prev, [type]: data.url }));
        showStatus(true, `Gambar berhasil diupload: ${data.url}`);
        router.refresh();
      } else {
        showStatus(false, data.message || 'Gagal mengupload gambar.');
      }
    } catch (err) {
      showStatus(false, 'Terjadi kesalahan saat upload.');
    } finally {
      setUploadingLogo(null);
    }
  };

  // CONTENT IMAGE UPLOAD HANDLER
  const handleContentImageUpload = async (file) => {
    if (!file) return;
    // Determine upload type based on current section
    const uploadType = cmsForm.section === 'team' ? 'team' : 'content';
    setUploadingContent(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', uploadType);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.success) {
        setCmsForm(prev => ({ ...prev, image_url: data.url }));
        showStatus(true, 'Gambar berhasil diupload.');
      } else {
        showStatus(false, data.message || 'Gagal mengupload gambar.');
      }
    } catch (err) {
      showStatus(false, 'Terjadi kesalahan saat upload.');
    } finally {
      setUploadingContent(false);
    }
  };

  // 1. SAVE SETTINGS (Global and Theme Styling combined)
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showStatus(true, 'Pengaturan global berhasil disimpan.');
        router.refresh();
      } else {
        showStatus(false, data.message || 'Gagal menyimpan pengaturan.');
      }
    } catch (err) {
      showStatus(false, 'Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  // 2. SAVE SECTION MANAGER
  const handleSaveSections = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showStatus(true, 'Status bagian (sections) berhasil diperbarui.');
        router.refresh();
      } else {
        showStatus(false, data.message || 'Gagal menyimpan konfigurasi.');
      }
    } catch (err) {
      showStatus(false, 'Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  // 3. NAVIGATION MANAGEMENT (Bulk save when order/active toggles)
  const saveNavigation = async (updatedNav) => {
    try {
      const res = await fetch('/api/admin/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ navigation: updatedNav })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNavigation(data.navigation);
        showStatus(true, 'Menu navigasi diperbarui.');
        router.refresh();
      } else {
        showStatus(false, data.message || 'Gagal memperbarui menu.');
      }
    } catch (err) {
      showStatus(false, 'Terjadi kesalahan jaringan.');
    }
  };

  const handleAddNavItem = (e) => {
    e.preventDefault();
    if (!newNavItem.label) return;
    const updated = [...navigation, { ...newNavItem, id: Date.now() }];
    setNavigation(updated);
    saveNavigation(updated);
    setNewNavItem({ label: '', url: '', is_active: 1 });
  };

  const handleDeleteNavItem = (index) => {
    openConfirm(
      'Hapus Menu Navigasi',
      'Item menu ini akan dihapus. Lanjutkan?',
      () => {
        const updated = navigation.filter((_, i) => i !== index);
        setNavigation(updated);
        saveNavigation(updated);
      }
    );
  };

  const handleMoveNavItem = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === navigation.length - 1) return;
    
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...navigation];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    
    setNavigation(updated);
    saveNavigation(updated);
  };

  const handleToggleNavItem = (index) => {
    const updated = [...navigation];
    updated[index].is_active = updated[index].is_active === 1 ? 0 : 1;
    setNavigation(updated);
    saveNavigation(updated);
  };

  // 4. CMS CONTENT CRUD OPERATIONS
  const handleSaveCmsContent = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const method = editingContent ? 'PUT' : 'POST';
    const payload = editingContent ? { id: cmsForm.id, ...cmsForm } : cmsForm;

    try {
      const res = await fetch('/api/admin/content', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showStatus(true, editingContent ? 'Konten berhasil diperbarui.' : 'Konten baru berhasil ditambahkan.');
        
        // Reload CMS list
        const listRes = await fetch('/api/admin/content');
        const listData = await listRes.json();
        if (listData.success) {
          setCmsContent(listData.content);
        }

        // Reset form
        setEditingContent(null);
        setCmsForm({ id: '', section: 'services', title: '', subtitle: '', image_url: '', content: '', order_index: 0 });
        router.refresh();
      } else {
        showStatus(false, data.message || 'Gagal menyimpan konten.');
      }
    } catch (err) {
      showStatus(false, 'Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCmsContent = (item) => {
    setEditingContent(item.id);
    setCmsForm({
      id: item.id,
      section: item.section,
      title: item.title || '',
      subtitle: item.subtitle || '',
      image_url: item.image_url || '',
      content: item.content || '',
      order_index: item.order_index || 0
    });
  };

  const handleDeleteCmsContent = async (id) => {
    openConfirm(
      'Hapus Konten',
      'Konten ini akan dihapus permanen dan tidak dapat dikembalikan. Lanjutkan?',
      async () => {
        try {
          const res = await fetch(`/api/admin/content?id=${id}`, { method: 'DELETE' });
          const data = await res.json();
          if (res.ok && data.success) {
            setCmsContent(cmsContent.filter(item => item.id !== id));
            showStatus(true, 'Konten berhasil dihapus.');
            router.refresh();
          } else {
            showStatus(false, data.message || 'Gagal menghapus konten.');
          }
        } catch (err) {
          showStatus(false, 'Terjadi kesalahan jaringan.');
        }
      }
    );
  };

  // 5. INBOUND SUBMISSIONS DELETE
  const handleDeleteSubmission = async (id) => {
    openConfirm(
      'Hapus Pesan',
      'Pesan masuk ini akan dihapus permanen. Lanjutkan?',
      async () => {
        try {
          const res = await fetch(`/api/contact?id=${id}`, { method: 'DELETE' });
          const data = await res.json();
          if (res.ok && data.success) {
            setSubmissions(submissions.filter(s => s.id !== id));
            showStatus(true, 'Pesan masuk berhasil dihapus.');
          } else {
            showStatus(false, data.message || 'Gagal menghapus pesan.');
          }
        } catch (err) {
          showStatus(false, 'Terjadi kesalahan jaringan.');
        }
      }
    );
  };

  // 6. LOGOUT
  const handleLogout = async () => {
    openConfirm(
      'Keluar dari Dashboard',
      'Sesi Anda akan diakhiri. Anda perlu login kembali untuk mengakses admin panel.',
      async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
          router.push('/admin/login');
          router.refresh();
        } catch {
          router.push('/admin/login');
        }
      }
    );
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '260px 1fr',
      minHeight: 'calc(100vh - 150px)',
      background: 'var(--bg-dark)',
      color: 'var(--text-light)',
      fontFamily: 'var(--font-family)',
      borderRadius: 'var(--border-radius-md)',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      margin: '2rem 5%'
    }} className="dark">
      {/* SIDEBAR NAVIGATION */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div style={{ paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-color)' }}>
            Admin Dashboard
          </h3>
          <p style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '0.25rem' }}>Core Engine v1.0</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
          <button 
            className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-outline'}`}
            style={{ justifyContent: 'flex-start', padding: '0.75rem 1.25rem', fontSize: '0.85rem' }}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Global Settings
          </button>
          <button 
            className={`btn ${activeTab === 'theme' ? 'btn-primary' : 'btn-outline'}`}
            style={{ justifyContent: 'flex-start', padding: '0.75rem 1.25rem', fontSize: '0.85rem' }}
            onClick={() => setActiveTab('theme')}
          >
            🎨 Theme & Styling
          </button>
          <button 
            className={`btn ${activeTab === 'sections' ? 'btn-primary' : 'btn-outline'}`}
            style={{ justifyContent: 'flex-start', padding: '0.75rem 1.25rem', fontSize: '0.85rem' }}
            onClick={() => setActiveTab('sections')}
          >
            🧩 Section Manager
          </button>
          <button 
            className={`btn ${activeTab === 'cms' ? 'btn-primary' : 'btn-outline'}`}
            style={{ justifyContent: 'flex-start', padding: '0.75rem 1.25rem', fontSize: '0.85rem' }}
            onClick={() => setActiveTab('cms')}
          >
            ✍️ Content Management
          </button>
          <button 
            className={`btn ${activeTab === 'submissions' ? 'btn-primary' : 'btn-outline'}`}
            style={{ justifyContent: 'flex-start', padding: '0.75rem 1.25rem', fontSize: '0.85rem' }}
            onClick={() => setActiveTab('submissions')}
          >
            📩 Inquiries ({submissions.length})
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <a href="/" target="_blank" className="btn btn-outline" style={{ fontSize: '0.85rem', width: '100%' }}>
            👁️ Preview Site
          </a>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ fontSize: '0.85rem', width: '100%', background: '#dc2626' }}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* DASHBOARD WORKSPACE */}
      <div style={{
        padding: '3rem',
        background: '#090d16',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        {/* ConfirmDialog (Radix AlertDialog) */}
        <ConfirmDialog
          open={confirmDialog.open}
          onOpenChange={closeConfirm}
          title={confirmDialog.title}
          description={confirmDialog.description}
          onConfirm={() => {
            closeConfirm();
            confirmDialog.onConfirm?.();
          }}
        />

        {/* TAB 1: GLOBAL SETTINGS */}
        {activeTab === 'settings' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem' }}>Global Settings</h2>
            <form onSubmit={handleSaveSettings} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Nama Perusahaan / Judul Website</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={settings.company_name || ''} 
                  onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Kontak</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={settings.email || ''} 
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Nomor WhatsApp (dengan kode negara, misal: +6281234567890)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={settings.whatsapp || ''} 
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Alamat Kantor</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={settings.address || ''} 
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                />
              </div>

              {/* ── LOGO UPLOAD SECTION ── */}
              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem 0 0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>🖼️ Logo & Favicon</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted-light)', marginTop: '0.25rem' }}>
                  Upload logo untuk mode terang, gelap, dan favicon. Format: PNG, JPG, SVG, WEBP, ICO. Maks 2MB.
                </p>
              </div>

              {/* Logo Light */}
              <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius-sm)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Logo – Mode Terang (Light)</label>
                {settings.logo_light && (
                  <div style={{ background: '#fff', borderRadius: '8px', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60px' }}>
                    <img src={settings.logo_light} alt="Logo Light" style={{ maxHeight: '50px', maxWidth: '180px', objectFit: 'contain' }} />
                  </div>
                )}
                <input
                  ref={logoLightRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleLogoUpload(e.target.files[0], 'logo_light')}
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ fontSize: '0.85rem' }}
                  disabled={uploadingLogo === 'logo_light'}
                  onClick={() => logoLightRef.current?.click()}
                >
                  {uploadingLogo === 'logo_light' ? '⏳ Mengupload...' : settings.logo_light ? '🔄 Ganti Logo Terang' : '📁 Upload Logo Terang'}
                </button>
                {settings.logo_light && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--primary-color)', wordBreak: 'break-all', margin: 0 }}>{settings.logo_light}</p>
                )}
              </div>

              {/* Logo Dark */}
              <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius-sm)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Logo – Mode Gelap (Dark)</label>
                {settings.logo_dark && (
                  <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60px' }}>
                    <img src={settings.logo_dark} alt="Logo Dark" style={{ maxHeight: '50px', maxWidth: '180px', objectFit: 'contain' }} />
                  </div>
                )}
                <input
                  ref={logoDarkRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleLogoUpload(e.target.files[0], 'logo_dark')}
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ fontSize: '0.85rem' }}
                  disabled={uploadingLogo === 'logo_dark'}
                  onClick={() => logoDarkRef.current?.click()}
                >
                  {uploadingLogo === 'logo_dark' ? '⏳ Mengupload...' : settings.logo_dark ? '🔄 Ganti Logo Gelap' : '📁 Upload Logo Gelap'}
                </button>
                {settings.logo_dark && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--primary-color)', wordBreak: 'break-all', margin: 0 }}>{settings.logo_dark}</p>
                )}
              </div>

              {/* Favicon */}
              <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '1.5rem', borderRadius: 'var(--border-radius-sm)', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                  <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Favicon (ICO / PNG 32×32)</label>
                  {settings.favicon && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={settings.favicon} alt="Favicon" style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', padding: '2px' }} />
                      <p style={{ fontSize: '0.75rem', color: 'var(--primary-color)', wordBreak: 'break-all', margin: 0 }}>{settings.favicon}</p>
                    </div>
                  )}
                </div>
                <input
                  ref={faviconRef}
                  type="file"
                  accept="image/*,.ico"
                  style={{ display: 'none' }}
                  onChange={(e) => handleLogoUpload(e.target.files[0], 'favicon')}
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ fontSize: '0.85rem', flexShrink: 0 }}
                  disabled={uploadingLogo === 'favicon'}
                  onClick={() => faviconRef.current?.click()}
                >
                  {uploadingLogo === 'favicon' ? '⏳ Mengupload...' : settings.favicon ? '🔄 Ganti Favicon' : '📁 Upload Favicon'}
                </button>
              </div>
              {/* ── END LOGO UPLOAD ── */}

              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem 0 0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>Meta SEO Tags</h3>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>SEO Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={settings.seo_title || ''} 
                  onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>SEO Keywords</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="tech, company, solution"
                  value={settings.seo_keywords || ''} 
                  onChange={(e) => setSettings({ ...settings, seo_keywords: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>SEO Description</label>
                <textarea 
                  className="form-control" 
                  value={settings.seo_description || ''} 
                  onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
                />
              </div>

              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem 0 0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>Media Sosial</h3>
              </div>

              <div className="form-group">
                <label>Facebook URL</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={settings.social_facebook || ''} 
                  onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Instagram URL</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={settings.social_instagram || ''} 
                  onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>LinkedIn URL</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={settings.social_linkedin || ''} 
                  onChange={(e) => setSettings({ ...settings, social_linkedin: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Twitter / X URL</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={settings.social_twitter || ''} 
                  onChange={(e) => setSettings({ ...settings, social_twitter: e.target.value })}
                />
              </div>

              {/* ── HERO SECTION CUSTOMIZATION ── */}
              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem 0 0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>🚀 Hero Section</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted-light)', marginTop: '0.25rem' }}>
                  Kustomisasi teks dan elemen visual di bagian hero halaman utama.
                </p>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Ikon Hero (emoji atau URL gambar)</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="🚀 atau /uploads/logo.png"
                    value={settings.hero_icon || ''}
                    onChange={(e) => setSettings({ ...settings, hero_icon: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  <input
                    ref={heroIconRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleLogoUpload(e.target.files[0], 'hero_icon')}
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                    disabled={uploadingLogo === 'hero_icon'}
                    onClick={() => heroIconRef.current?.click()}
                  >
                    {uploadingLogo === 'hero_icon' ? '⏳...' : '📁 Upload'}
                  </button>
                </div>
                {settings.hero_icon && (settings.hero_icon.startsWith('/') || settings.hero_icon.startsWith('http')) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                    <img src={settings.hero_icon} alt="Hero Icon Preview" style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <button
                      type="button"
                      className="btn"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#dc2626', color: 'white' }}
                      onClick={() => setSettings({ ...settings, hero_icon: '' })}
                    >
                      Hapus Gambar
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Gambar Utama Hero (Tampil di Setengah Section Kanan)</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="URL gambar / uploads/..."
                    value={settings.hero_image || ''}
                    onChange={(e) => setSettings({ ...settings, hero_image: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  <input
                    ref={heroImageRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleLogoUpload(e.target.files[0], 'hero_image')}
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                    disabled={uploadingLogo === 'hero_image'}
                    onClick={() => heroImageRef.current?.click()}
                  >
                    {uploadingLogo === 'hero_image' ? '⏳...' : '📁 Upload'}
                  </button>
                </div>
                {settings.hero_image && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                    <img src={settings.hero_image} alt="Hero Image Preview" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <button
                      type="button"
                      className="btn"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#dc2626', color: 'white' }}
                      onClick={() => setSettings({ ...settings, hero_image: '' })}
                    >
                      Hapus Gambar
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Hero Card Tagline (teks kecil di bawah nama perusahaan pada kartu hero)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Scale. Customize. Clone."
                  value={settings.hero_card_tagline || ''}
                  onChange={(e) => setSettings({ ...settings, hero_card_tagline: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Tombol Hero Utama (Primary Button)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Layanan Kami"
                  value={settings.hero_btn_primary || ''}
                  onChange={(e) => setSettings({ ...settings, hero_btn_primary: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Tombol Hero Sekunder (Outline Button)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Hubungi Kami"
                  value={settings.hero_btn_secondary || ''}
                  onChange={(e) => setSettings({ ...settings, hero_btn_secondary: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Stat Pill 1 (contoh: ✅ 50+ Proyek)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="✅ 50+ Proyek"
                  value={settings.hero_stat1 || ''}
                  onChange={(e) => setSettings({ ...settings, hero_stat1: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Stat Pill 2 (contoh: ⭐ 100% Klien Puas)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="⭐ 100% Klien Puas"
                  value={settings.hero_stat2 || ''}
                  onChange={(e) => setSettings({ ...settings, hero_stat2: e.target.value })}
                />
              </div>

              {/* ── ABOUT SECTION ── */}
              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem 0 0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>ℹ️ About Section</h3>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Gambar About (Kiri)</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="URL gambar / uploads/..."
                    value={settings.about_image || ''}
                    onChange={(e) => setSettings({ ...settings, about_image: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  <input
                    ref={aboutImageRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleLogoUpload(e.target.files[0], 'about_image')}
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                    disabled={uploadingLogo === 'about_image'}
                    onClick={() => aboutImageRef.current?.click()}
                  >
                    {uploadingLogo === 'about_image' ? '⏳...' : '📁 Upload'}
                  </button>
                </div>
                {settings.about_image && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                    <img src={settings.about_image} alt="About Image Preview" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <button
                      type="button"
                      className="btn"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#dc2626', color: 'white' }}
                      onClick={() => setSettings({ ...settings, about_image: '' })}
                    >
                      Hapus Gambar
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Teks Tombol CTA About (misal: Kemitraan & Kolaborasi)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Kemitraan & Kolaborasi"
                  value={settings.about_cta_label || ''}
                  onChange={(e) => setSettings({ ...settings, about_cta_label: e.target.value })}
                />
              </div>

              {/* ── VISION SECTION ── */}
              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem 0 0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>👁️ Vision Section</h3>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Gambar Vision (Kanan)</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="URL gambar / uploads/..."
                    value={settings.vision_image || ''}
                    onChange={(e) => setSettings({ ...settings, vision_image: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  <input
                    ref={visionImageRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleLogoUpload(e.target.files[0], 'vision_image')}
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                    disabled={uploadingLogo === 'vision_image'}
                    onClick={() => visionImageRef.current?.click()}
                  >
                    {uploadingLogo === 'vision_image' ? '⏳...' : '📁 Upload'}
                  </button>
                </div>
                {settings.vision_image && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                    <img src={settings.vision_image} alt="Vision Image Preview" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <button
                      type="button"
                      className="btn"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#dc2626', color: 'white' }}
                      onClick={() => setSettings({ ...settings, vision_image: '' })}
                    >
                      Hapus Gambar
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group" style={{ opacity: 0.5 }}>
                {/* Empty spacer to keep grid aligned */}
              </div>

              {/* ── MISSION SECTION ── */}
              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem 0 0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>🧗 Mission Section</h3>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Gambar Mission (Kiri)</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="URL gambar / uploads/..."
                    value={settings.mission_image || ''}
                    onChange={(e) => setSettings({ ...settings, mission_image: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  <input
                    ref={missionImageRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleLogoUpload(e.target.files[0], 'mission_image')}
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                    disabled={uploadingLogo === 'mission_image'}
                    onClick={() => missionImageRef.current?.click()}
                  >
                    {uploadingLogo === 'mission_image' ? '⏳...' : '📁 Upload'}
                  </button>
                </div>
                {settings.mission_image && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                    <img src={settings.mission_image} alt="Mission Image Preview" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <button
                      type="button"
                      className="btn"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#dc2626', color: 'white' }}
                      onClick={() => setSettings({ ...settings, mission_image: '' })}
                    >
                      Hapus Gambar
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group" style={{ opacity: 0.5 }}>
                {/* Empty spacer */}
              </div>

              {/* ── CONTACT SECTION ── */}
              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem 0 0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>📬 Contact Panel</h3>
              </div>

              <div className="form-group">
                <label>Judul Panel Kontak (contoh: Mari Berkolaborasi)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Mari Berkolaborasi"
                  value={settings.contact_panel_title || ''}
                  onChange={(e) => setSettings({ ...settings, contact_panel_title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Deskripsi Panel Kontak</label>
                <textarea
                  className="form-control"
                  placeholder="Silakan isi formulir atau hubungi kami langsung..."
                  value={settings.contact_panel_text || ''}
                  onChange={(e) => setSettings({ ...settings, contact_panel_text: e.target.value })}
                  style={{ minHeight: '80px' }}
                />
              </div>

              {/* ── FOOTER SETTINGS ── */}
              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem 0 0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>🦶 Footer Settings</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted-light)', marginTop: '0.25rem' }}>
                  Teks yang tampil di bagian bawah halaman website.
                </p>
              </div>

              <div className="form-group">
                <label>Teks Hak Cipta Footer (setelah nama perusahaan)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="All rights reserved."
                  value={settings.footer_copyright || ''}
                  onChange={(e) => setSettings({ ...settings, footer_copyright: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Tagline Footer (baris ke-2 kecil, kosongkan untuk disembunyikan)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Powered by Company CMS Engine"
                  value={settings.footer_tagline || ''}
                  onChange={(e) => setSettings({ ...settings, footer_tagline: e.target.value })}
                />
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: THEME & STYLING */}
        {activeTab === 'theme' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem' }}>Theme & Styling</h2>
            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px' }}>
              
              <div className="form-group" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Primary Color</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="color" 
                      style={{ width: '45px', height: '45px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      value={settings.primary_color || '#4f46e5'} 
                      onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    />
                    <input 
                      type="text" 
                      className="form-control" 
                      style={{ flex: 1 }}
                      value={settings.primary_color || '#4f46e5'} 
                      onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Secondary Color (Footer Background)</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="color" 
                      style={{ width: '45px', height: '45px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      value={settings.secondary_color || '#0f172a'} 
                      onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                    />
                    <input 
                      type="text" 
                      className="form-control" 
                      style={{ flex: 1 }}
                      value={settings.secondary_color || '#0f172a'} 
                      onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Font Choice (Google Fonts)</label>
                <select 
                  className="form-control"
                  value={settings.font_family || 'Inter'}
                  onChange={(e) => setSettings({ ...settings, font_family: e.target.value })}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="Inter">Inter (Clean, Modern)</option>
                  <option value="Roboto">Roboto (Technical, Standard)</option>
                  <option value="Poppins">Poppins (Vibrant, Friendly)</option>
                  <option value="Montserrat">Montserrat (Strong, Elegant)</option>
                  <option value="Playfair Display">Playfair Display (Classy Serif)</option>
                  <option value="Lora">Lora (Warm Literary Serif)</option>
                </select>
              </div>

              <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--primary-color)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 'bold', textTransform: 'uppercase' }}>Preview Teks</span>
                <h3 style={{ 
                  fontFamily: settings.font_family || 'Inter', 
                  fontSize: '1.5rem', 
                  margin: '0.5rem 0',
                  color: 'var(--text-light)' 
                }}>
                  The quick brown fox jumps over the lazy dog.
                </h3>
                <p style={{ 
                  fontFamily: settings.font_family || 'Inter', 
                  fontSize: '0.95rem',
                  color: 'var(--text-muted-light)' 
                }}>
                  Selamat datang di Multi-Purpose Company Profile Engine. Teks ini menggunakan font pilihan Anda.
                </p>
              </div>

              <div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Terapkan Desain'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: SECTION MANAGER */}
        {activeTab === 'sections' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem' }}>Section Manager</h2>
            <p style={{ color: 'var(--text-muted-light)', marginBottom: '2rem' }}>
              Aktifkan/non-aktifkan bagian halaman landing page dan edit teks judul/sub-judulnya.
            </p>

            <form onSubmit={handleSaveSections} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {sections.map((sec, idx) => (
                  <div key={sec.key} className="glass-panel" style={{
                    padding: '2rem',
                    borderRadius: 'var(--border-radius-md)',
                    display: 'grid',
                    gridTemplateColumns: '150px 1fr 1fr 100px',
                    gap: '1.5rem',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--primary-color)' }}>
                        {sec.key}
                      </span>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Judul Bagian"
                        value={sec.title || ''}
                        onChange={(e) => {
                          const updated = [...sections];
                          updated[idx].title = e.target.value;
                          setSections(updated);
                        }}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Sub-judul Bagian"
                        value={sec.subtitle || ''}
                        onChange={(e) => {
                          const updated = [...sections];
                          updated[idx].subtitle = e.target.value;
                          setSections(updated);
                        }}
                      />
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox"
                          checked={sec.is_active === 1}
                          onChange={(e) => {
                            const updated = [...sections];
                            updated[idx].is_active = e.target.checked ? 1 : 0;
                            setSections(updated);
                          }}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        Aktif
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan Konfigurasi Halaman'}
                </button>
              </div>
            </form>
          </div>
        )}


        {/* TAB 5: CMS CONTENT CRUD */}
        {activeTab === 'cms' && (
          <div>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>CMS Content Manager</h2>
              <p style={{ color: 'var(--text-muted-light)', fontSize: '0.95rem' }}>
                Kelola isi konten setiap section halaman landing page.
              </p>
            </div>

            {/* Section filter tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['all', 'about', 'vision', 'mission', 'services', 'portfolio', 'testimonials', 'team'].map(s => (
                <button
                  key={s}
                  onClick={() => setCmsFilter(s)}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '999px',
                    border: '1px solid',
                    borderColor: cmsFilter === s ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                    background: cmsFilter === s ? 'var(--primary-color)' : 'transparent',
                    color: cmsFilter === s ? 'white' : 'rgba(255,255,255,0.6)',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s',
                  }}
                >
                  {s === 'all' ? `Semua (${cmsContent.length})` : `${s} (${cmsContent.filter(x => x.section === s).length})`}
                </button>
              ))}
            </div>

            {/* Content Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.25rem',
              marginBottom: '3rem'
            }}>
              {cmsContent
                .filter(item => cmsFilter === 'all' || item.section === cmsFilter)
                .map(item => (
                  <div
                    key={item.id}
                    style={{
                      background: editingContent === item.id
                        ? 'rgba(79,70,229,0.08)'
                        : 'rgba(255,255,255,0.03)',
                      border: editingContent === item.id
                        ? '1px solid rgba(79,70,229,0.5)'
                        : '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                    }}
                  >
                    {/* Image / Emoji Thumbnail */}
                    {item.image_url && (
                      <div style={{
                        height: item.image_url.startsWith('/') || item.image_url.startsWith('http') ? '140px' : '70px',
                        background: 'rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        {item.image_url.startsWith('/') || item.image_url.startsWith('http') ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span style={{ fontSize: '2.5rem' }}>{item.image_url}</span>
                        )}
                      </div>
                    )}

                    {/* Card Body */}
                    <div style={{ padding: '1rem 1.1rem' }}>
                      {/* Section badge */}
                      <span style={{
                        display: 'inline-block',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                        color: 'var(--primary-color)',
                        background: 'rgba(79,70,229,0.12)',
                        borderRadius: '4px',
                        padding: '0.15rem 0.5rem',
                        marginBottom: '0.5rem',
                      }}>
                        {item.section}
                      </span>

                      <h4 style={{ fontSize: '0.98rem', fontWeight: '700', marginBottom: '0.2rem', color: '#f1f5f9' }}>
                        {item.title}
                      </h4>
                      {item.subtitle && (
                        <p style={{ fontSize: '0.78rem', color: 'var(--primary-color)', fontWeight: '600', marginBottom: '0.4rem' }}>
                          {item.subtitle}
                        </p>
                      )}
                      {item.content && (
                        <p style={{
                          fontSize: '0.82rem',
                          color: '#64748b',
                          lineHeight: 1.5,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          marginBottom: '0.75rem',
                        }}>
                          {item.content}
                        </p>
                      )}

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => {
                            handleEditCmsContent(item);
                            document.getElementById('cms-editor-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          style={{
                            flex: 1,
                            padding: '0.45rem 0',
                            borderRadius: '7px',
                            border: '1px solid rgba(79,70,229,0.4)',
                            background: editingContent === item.id ? 'var(--primary-color)' : 'rgba(79,70,229,0.1)',
                            color: editingContent === item.id ? 'white' : 'var(--primary-color)',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                          }}
                        >
                          {editingContent === item.id ? '✏️ Sedang Edit' : '✏️ Edit'}
                        </button>
                        <button
                          onClick={() => handleDeleteCmsContent(item.id)}
                          style={{
                            padding: '0.45rem 0.75rem',
                            borderRadius: '7px',
                            border: '1px solid rgba(239,68,68,0.3)',
                            background: 'rgba(239,68,68,0.08)',
                            color: '#f87171',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            transition: 'all 0.2s',
                          }}
                          title="Hapus konten ini"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {cmsContent.filter(item => cmsFilter === 'all' || item.section === cmsFilter).length === 0 && (
                <div style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  border: '2px dashed rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  color: 'rgba(255,255,255,0.3)',
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
                  <p style={{ fontSize: '0.9rem' }}>Belum ada konten di section ini.</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.3rem', opacity: 0.7 }}>Gunakan form di bawah untuk menambahkan konten baru.</p>
                </div>
              )}
            </div>

            {/* Add / Edit Form */}
            <div className="glass-panel" id="cms-editor-form" style={{ padding: '3rem 2rem', borderRadius: 'var(--border-radius-md)', border: editingContent ? '2px solid var(--primary-color)' : '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                {editingContent ? `📝 Edit Item Content (ID: ${cmsForm.id})` : '➕ Tambah Konten Baru'}
              </h3>
              
              <form onSubmit={handleSaveCmsContent} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label>Section Tujuan</label>
                  <select 
                    className="form-control"
                    value={cmsForm.section}
                    onChange={(e) => setCmsForm({ ...cmsForm, section: e.target.value })}
                  >
                    <option value="about">About (Teks Utama)</option>
                    <option value="vision">Vision (Visi Perusahaan)</option>
                    <option value="mission">Mission (Misi Perusahaan)</option>
                    <option value="services">Services (Grid Layanan)</option>
                    <option value="portfolio">Portfolio (Grid Proyek)</option>
                    <option value="testimonials">Testimonials (Ulasan Client)</option>
                    <option value="team">Our Team (Anggota Tim)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Urutan Tampil (Order Index)</label>
                  <input 
                    type="number" 
                    className="form-control"
                    value={cmsForm.order_index}
                    onChange={(e) => setCmsForm({ ...cmsForm, order_index: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Judul / Heading Utama (e.g. Nama Jasa, Nama Proyek, Nama Klien)</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={cmsForm.title}
                    onChange={(e) => setCmsForm({ ...cmsForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Sub-judul / Tag / Jabatan Klien</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={cmsForm.subtitle}
                    onChange={(e) => setCmsForm({ ...cmsForm, subtitle: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Gambar / Emoji Icon</label>
                  {/* Image preview */}
                  {cmsForm.image_url && cmsForm.image_url.startsWith('/') && (
                    <div style={{ marginBottom: '0.5rem', borderRadius: '8px', overflow: 'hidden', maxHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <img src={cmsForm.image_url} alt="preview" style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>
                  )}
                  {/* Emoji / URL text input */}
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Emoji (e.g. 💻) atau URL gambar"
                    value={cmsForm.image_url}
                    onChange={(e) => setCmsForm({ ...cmsForm, image_url: e.target.value })}
                    style={{ marginBottom: '0.5rem' }}
                  />
                  {/* File upload button */}
                  <input
                    ref={contentImageRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleContentImageUpload(e.target.files[0])}
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ fontSize: '0.82rem', padding: '0.5rem 1rem', width: '100%' }}
                    disabled={uploadingContent}
                    onClick={() => contentImageRef.current?.click()}
                  >
                    {uploadingContent ? '⏳ Mengupload...' : '📁 Upload Gambar (PNG/JPG/WEBP, maks 5MB)'}
                  </button>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Konten Deskripsi / Detail Teks / Ulasan Testimoni</label>
                  <textarea 
                    className="form-control"
                    value={cmsForm.content}
                    onChange={(e) => setCmsForm({ ...cmsForm, content: e.target.value })}
                    style={{ minHeight: '120px' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Menyimpan...' : editingContent ? 'Simpan Perubahan' : 'Tambah Konten'}
                  </button>

                  {editingContent && (
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => {
                        setEditingContent(null);
                        setCmsForm({ id: '', section: 'services', title: '', subtitle: '', image_url: '', content: '', order_index: 0 });
                      }}
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 6: CUSTOMER INBOUND INQUIRIES */}
        {activeTab === 'submissions' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem' }}>Customer Inquiries</h2>
            <p style={{ color: 'var(--text-muted-light)', marginBottom: '2.5rem' }}>
              Daftar pesan masuk yang dikirimkan oleh pengunjung melalui formulir "Hubungi Kami" di website utama.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {submissions.map(sub => (
                <div key={sub.id} className="glass-panel" style={{
                  padding: '2rem',
                  borderRadius: 'var(--border-radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{sub.name}</h4>
                      <a href={`mailto:${sub.email}`} style={{ fontSize: '0.85rem', color: 'var(--primary-color)', textDecoration: 'none' }}>
                        {sub.email}
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>
                        {new Date(sub.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                      <button 
                        onClick={() => handleDeleteSubmission(sub.id)}
                        className="btn"
                        style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem', background: '#dc2626', color: 'white' }}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.95rem', lineHeight: 1.5, background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)', whiteSpace: 'pre-wrap' }}>
                    {sub.message}
                  </p>
                </div>
              ))}

              {submissions.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
                  <span style={{ fontSize: '3rem' }}>✉️</span>
                  <p style={{ marginTop: '1rem' }}>Belum ada pesan masuk dari customer.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
