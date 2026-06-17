/**
 * Formats a market count for sidebar and chip labels (e.g. 1500 → "1.5K").
 */
export function formatMarketCount(count: number): string {
  if (!Number.isFinite(count) || count < 0) {
    return '0';
  }

  if (count >= 1_000_000) {
    const millions = count / 1_000_000;
    return millions >= 10
      ? `${Math.round(millions)}M`
      : `${millions.toFixed(1).replace(/\.0$/, '')}M`;
  }

  if (count >= 1_000) {
    const thousands = count / 1_000;
    return thousands >= 10
      ? `${Math.round(thousands)}K`
      : `${thousands.toFixed(1).replace(/\.0$/, '')}K`;
  }

  return String(count);
}
