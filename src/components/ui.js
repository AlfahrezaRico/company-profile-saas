'use client';

/**
 * Reusable Radix-based UI primitives for the Admin Dashboard.
 * - ConfirmDialog: replaces native browser confirm()
 * - Toast system: replaces native alert/status messages
 */

import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as Toast from '@radix-ui/react-toast';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useState, createContext, useContext, useCallback } from 'react';

/* ─────────────────────────────────────────────
   TOAST CONTEXT
───────────────────────────────────────────── */
const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  }, []);

  return (
    <ToastCtx.Provider value={addToast}>
      <Toast.Provider swipeDirection="right">
        {children}

        {toasts.map(t => (
          <Toast.Root
            key={t.id}
            open
            onOpenChange={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
            style={{
              position: 'fixed',
              bottom: '1.5rem',
              right: '1.5rem',
              zIndex: 9999,
              minWidth: '300px',
              maxWidth: '420px',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              background: t.type === 'success'
                ? 'linear-gradient(135deg, #064e3b, #065f46)'
                : 'linear-gradient(135deg, #7f1d1d, #991b1b)',
              border: `1px solid ${t.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              color: 'white',
              animation: 'toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>
              {t.type === 'success' ? '✅' : '❌'}
            </span>
            <Toast.Description style={{ flex: 1, fontSize: '0.9rem', lineHeight: 1.4 }}>
              {t.message}
            </Toast.Description>
            <Toast.Close
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                padding: '0.2rem 0.5rem',
                fontSize: '0.8rem',
                flexShrink: 0,
              }}
            >
              ✕
            </Toast.Close>
          </Toast.Root>
        ))}

        <Toast.Viewport />
      </Toast.Provider>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}

/* ─────────────────────────────────────────────
   CONFIRM DIALOG (replaces native confirm())
───────────────────────────────────────────── */
export function ConfirmDialog({
  open,
  onOpenChange,
  title = 'Konfirmasi',
  description = 'Apakah Anda yakin?',
  confirmLabel = 'Ya, Hapus',
  cancelLabel = 'Batal',
  danger = true,
  onConfirm,
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        {/* Overlay */}
        <AlertDialog.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 8000,
            animation: 'fadeIn 0.15s ease',
          }}
        />
        {/* Content */}
        <AlertDialog.Content
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 8001,
            background: '#0f172a',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '2rem',
            width: '90vw',
            maxWidth: '420px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            animation: 'dialogIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: danger ? 'rgba(239,68,68,0.15)' : 'rgba(79,70,229,0.15)',
              border: `1px solid ${danger ? 'rgba(239,68,68,0.3)' : 'rgba(79,70,229,0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              flexShrink: 0,
            }}>
              {danger ? '🗑️' : '⚠️'}
            </div>
            <div>
              <AlertDialog.Title style={{
                color: '#f1f5f9',
                fontSize: '1.1rem',
                fontWeight: '700',
                marginBottom: '0.4rem',
              }}>
                {title}
              </AlertDialog.Title>
              <AlertDialog.Description style={{
                color: '#94a3b8',
                fontSize: '0.9rem',
                lineHeight: 1.5,
              }}>
                {description}
              </AlertDialog.Description>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <AlertDialog.Cancel asChild>
              <button style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.88rem',
                fontWeight: '500',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
              >
                {cancelLabel}
              </button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <button
                onClick={onConfirm}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: danger
                    ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                    : 'linear-gradient(135deg, #4f46e5, #4338ca)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  boxShadow: danger
                    ? '0 4px 12px rgba(220,38,38,0.3)'
                    : '0 4px 12px rgba(79,70,229,0.3)',
                }}
                onMouseEnter={e => e.target.style.opacity = '0.9'}
                onMouseLeave={e => e.target.style.opacity = '1'}
              >
                {confirmLabel}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

/* ─────────────────────────────────────────────
   TOOLTIP WRAPPER
───────────────────────────────────────────── */
export function TipButton({ tip, children, ...props }) {
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button {...props}>{children}</button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={6}
            style={{
              background: '#1e293b',
              color: '#f1f5f9',
              padding: '0.3rem 0.7rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              zIndex: 9000,
            }}
          >
            {tip}
            <Tooltip.Arrow style={{ fill: '#1e293b' }} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
