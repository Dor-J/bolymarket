/**
 * Clamps a probability to the valid 0–1 range.
 */
function clampPrice(price: number): number {
  if (!Number.isFinite(price)) {
    return 0;
  }

  return Math.min(1, Math.max(0, price));
}

/**
 * Formats a 0–1 price as a percentage string (e.g. 0.16 → "16%").
 */
export function formatPercent(price: number, decimals = 0): string {
  const clamped = clampPrice(price);
  const percent = clamped * 100;

  if (decimals === 0) {
    return `${Math.round(percent)}%`;
  }

  return `${percent.toFixed(decimals)}%`;
}

/**
 * Formats a 0–1 price as cents (e.g. 0.163 → "16.3¢").
 */
export function formatCents(price: number): string {
  const clamped = clampPrice(price);
  const cents = clamped * 100;
  const formatted =
    cents % 1 === 0 ? cents.toFixed(0) : cents.toFixed(1).replace(/\.0$/, '');

  return `${formatted}¢`;
}

/**
 * Returns the display probability for a binary Yes outcome.
 */
export function getYesDisplayPrice(
  outcomes: Array<{ name: string; price: number }>,
): number {
  const yes =
    outcomes.find((outcome) => outcome.name.toLowerCase() === 'yes') ??
    outcomes[0];

  return yes ? clampPrice(yes.price) : 0;
}
