/** Form input with label. */

import React from 'react';

export function Input({ label, ...rest }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
      <span style={{ color: 'var(--sx-muted)', fontWeight: 700 }}>{label}</span>
      <input
        {...rest}
        style={{
          padding: '12px 12px',
          borderRadius: 10,
          border: '1px solid var(--sx-border)',
          background: 'rgba(255,255,255,0.04)',
          color: 'var(--sx-text)',
          outline: 'none',
          fontFamily: 'inherit',
        }}
      />
    </label>
  );
}
