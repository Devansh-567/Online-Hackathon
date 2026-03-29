/** Currency and date formatting helpers for dashboard tables. */

export function formatMoney(amount, currency = 'USD') {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(Number(amount));
  } catch {
    return `${amount} ${currency}`;
  }
}

export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export function riskTone(score) {
  if (score >= 75) return 'danger';
  if (score >= 50) return 'warn';
  return 'ok';
}
