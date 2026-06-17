/**
 * Formats a 0–1 sports price as rounded cents (`42¢`).
 */
export function formatSportsCents(price: number): string {
  if (!Number.isFinite(price)) {
    return '0¢';
  }

  const cents = Math.round(Math.min(1, Math.max(0, price)) * 100);
  return `${cents}¢`;
}
