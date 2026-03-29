/** Create-expense form with optional OCR simulation meta. */

import React, { useState } from 'react';
import { EXPENSE_CATEGORIES } from '../../utils/constants.js';
import { createExpense } from '../../services/expenseService.js';
import { Button } from '../UI/Button.jsx';
import { Input } from '../UI/Input.jsx';

export function ExpenseForm({ onCreated }) {
  const [title, setTitle] = useState('Team offsite — taxis');
  const [category, setCategory] = useState('TRAVEL');
  const [amount, setAmount] = useState('128.40');
  const [currency, setCurrency] = useState('USD');
  const [merchant, setMerchant] = useState('Metro Transit');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const payload = {
        title,
        category,
        amount: Number(amount),
        currency,
        merchant,
        receiptMeta: { name: 'receipt.png', type: 'image/png' }, // triggers OCR simulation on API
      };
      const created = await createExpense(payload);
      setMsg(`Created ${created.id} — status ${created.status}`);
      onCreated?.(created);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="sx-form" onSubmit={submit}>
      <div className="sx-row" style={{ width: '100%' }}>
        <div style={{ flex: '1 1 260px' }}>
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, flex: '0 0 180px' }}>
          <span style={{ color: 'var(--sx-muted)', fontWeight: 700 }}>Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: '12px 12px',
              borderRadius: 10,
              border: '1px solid var(--sx-border)',
              background: 'rgba(255,255,255,0.04)',
              color: 'var(--sx-text)',
            }}
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="sx-row" style={{ width: '100%' }}>
        <div style={{ flex: '1 1 180px' }}>
          <Input label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
        </div>
        <div style={{ flex: '0 0 140px' }}>
          <Input label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
        </div>
        <div style={{ flex: '1 1 240px' }}>
          <Input label="Merchant" value={merchant} onChange={(e) => setMerchant(e.target.value)} />
        </div>
      </div>
      <Button type="submit" disabled={busy} variant="primary">
        {busy ? 'Submitting…' : 'Submit expense (with OCR simulation)'}
      </Button>
      {msg ? <div style={{ color: 'var(--sx-muted)', fontSize: 13 }}>{msg}</div> : null}
    </form>
  );
}
