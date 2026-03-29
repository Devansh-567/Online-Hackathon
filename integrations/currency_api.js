/**
 * FX rates helper — uses static fallback table; swap for exchangerate.host or ECB API.
 */

const FALLBACK_RATES_TO_USD = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  INR: 0.012,
  JPY: 0.0067,
};

export function convertToBase(amount, fromCurrency, toCurrency = 'USD') {
  const from = String(fromCurrency || 'USD').toUpperCase();
  const to = String(toCurrency || 'USD').toUpperCase();
  const rateFrom = FALLBACK_RATES_TO_USD[from] ?? 1;
  const rateTo = FALLBACK_RATES_TO_USD[to] ?? 1;
  const usd = amount * rateFrom;
  return Number((usd / rateTo).toFixed(2));
}

export async function fetchLiveRate(from, to) {
  // Placeholder: would call external API with API key
  return { from, to, rate: convertToBase(1, from, to), live: false, asOf: new Date().toISOString() };
}
