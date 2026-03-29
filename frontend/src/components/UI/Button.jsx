/** Primary action button with variants. */

import React from 'react';

const base = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid transparent',
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
  textDecoration: 'none',
};

export function Button({ children, variant = 'primary', ...rest }) {
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--sx-accent), var(--sx-accent-2))',
      color: '#041016',
    },
    ghost: { background: 'transparent', color: 'var(--sx-text)', borderColor: 'var(--sx-border)' },
    danger: { background: 'rgba(248,113,113,0.12)', color: 'var(--sx-danger)', borderColor: 'rgba(248,113,113,0.3)' },
  };

  return (
    <button type="button" style={{ ...base, ...variants[variant] }} {...rest}>
      {children}
    </button>
  );
}
