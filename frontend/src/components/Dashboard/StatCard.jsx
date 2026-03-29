/** KPI tile used on the landing dashboard. */

import React from 'react';
import { Card } from '../UI/Card.jsx';

export function StatCard({ title, value, hint, tone = 'default' }) {
  const color =
    tone === 'danger' ? 'var(--sx-danger)' : tone === 'warn' ? 'var(--sx-warn)' : 'var(--sx-text)';
  return (
    <Card title={title} subtitle={hint}>
      <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-0.03em', color }}>{value}</div>
    </Card>
  );
}
