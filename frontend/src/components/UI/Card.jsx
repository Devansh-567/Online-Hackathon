/** Surface card for KPIs and panels. */

import React from 'react';

export function Card({ title, subtitle, children, right }) {
  return (
    <div
      style={{
        borderRadius: 'var(--sx-radius)',
        border: '1px solid var(--sx-border)',
        background: 'linear-gradient(180deg, rgba(18,24,38,0.95), rgba(18,24,38,0.8))',
        boxShadow: 'var(--sx-shadow)',
        padding: 16,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{title}</div>
          {subtitle ? <div style={{ color: 'var(--sx-muted)', marginTop: 6, fontSize: 13 }}>{subtitle}</div> : null}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}
