/** Recent workflow events pulled from expense history. */

import React, { useMemo } from 'react';
import { formatDate } from '../../utils/formatters.js';

export function ActivityFeed({ expenses }) {
  const items = useMemo(() => {
    const out = [];
    for (const e of expenses || []) {
      const hist = e.workflow?.history || [];
      for (const h of hist.slice(-3)) {
        out.push({ expense: e.title, ...h });
      }
    }
    return out.slice(-8).reverse();
  }, [expenses]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.length === 0 ? (
        <div style={{ color: 'var(--sx-muted)' }}>No recent activity.</div>
      ) : (
        items.map((it, idx) => (
          <div
            key={`${idx}-${it.at}`}
            style={{
              padding: 12,
              borderRadius: 12,
              border: '1px solid var(--sx-border)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <div style={{ fontWeight: 800 }}>{it.action}</div>
            <div style={{ color: 'var(--sx-muted)', fontSize: 13, marginTop: 6 }}>
              {it.expense} · {formatDate(it.at)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
