/** Lightweight modal for confirmations. */

import React from 'react';
import { Button } from './Button.jsx';

export function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'grid',
        placeItems: 'center',
        padding: 18,
        zIndex: 50,
      }}
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        style={{
          width: 'min(520px, 100%)',
          borderRadius: 16,
          border: '1px solid var(--sx-border)',
          background: 'var(--sx-surface)',
          padding: 18,
          boxShadow: 'var(--sx-shadow)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
          <div style={{ fontWeight: 900 }}>{title}</div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <div style={{ color: 'var(--sx-muted)', lineHeight: 1.5 }}>{children}</div>
        {footer ? <div style={{ marginTop: 14 }}>{footer}</div> : null}
      </div>
    </div>
  );
}
