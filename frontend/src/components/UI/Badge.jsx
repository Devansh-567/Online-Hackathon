/** Status / tag chip. */

import React from 'react';

export function Badge({ children, tone = 'muted' }) {
  const tones = {
    muted: { border: 'var(--sx-border)', color: 'var(--sx-muted)', bg: 'rgba(255,255,255,0.03)' },
    ok: { border: 'rgba(52,211,153,0.35)', color: 'var(--sx-ok)', bg: 'rgba(52,211,153,0.08)' },
    warn: { border: 'rgba(251,191,36,0.35)', color: 'var(--sx-warn)', bg: 'rgba(251,191,36,0.08)' },
    danger: { border: 'rgba(248,113,113,0.35)', color: 'var(--sx-danger)', bg: 'rgba(248,113,113,0.08)' },
  };
  const t = tones[tone] || tones.muted;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: 999,
        border: `1px solid ${t.border}`,
        background: t.bg,
        color: t.color,
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: 0.02,
      }}
    >
      {children}
    </span>
  );
}
