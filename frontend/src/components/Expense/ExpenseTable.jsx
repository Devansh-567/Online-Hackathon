/** Sortable-style table for expenses (read-only presentation). */

import React from 'react';
import { formatDate, formatMoney, riskTone } from '../../utils/formatters.js';
import { ExpenseStatusBadge } from './ExpenseStatusBadge.jsx';
import { Badge } from '../UI/Badge.jsx';

export function ExpenseTable({ rows, onSelect }) {
  return (
    <div className="sx-table-wrap">
      <table className="sx-table">
        <thead>
          <tr>
            <th>Expense</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Risk</th>
            <th>Trust</th>
            <th>Status</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ cursor: onSelect ? 'pointer' : 'default' }} onClick={() => onSelect?.(r)}>
              <td>
                <div style={{ fontWeight: 800 }}>{r.title}</div>
                <div style={{ color: 'var(--sx-muted)', fontSize: 12, marginTop: 4 }}>{r.merchant || '—'}</div>
              </td>
              <td>{r.category}</td>
              <td style={{ fontFamily: 'var(--sx-mono)' }}>{formatMoney(r.amount, r.currency)}</td>
              <td>
                <Badge tone={riskTone(r.riskScore || 0)}>{Math.round(r.riskScore || 0)}</Badge>
              </td>
              <td>{Math.round(r.trustScore || 0)}</td>
              <td>
                <ExpenseStatusBadge status={r.status} />
              </td>
              <td style={{ color: 'var(--sx-muted)' }}>{formatDate(r.updatedAt || r.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
