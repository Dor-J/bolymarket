/**
 * Formats volume with full precision for the event detail meta row.
 */
export function formatDetailVolume(volume: number): string {
  if (!Number.isFinite(volume) || volume <= 0) {
    return '$0 Vol.';
  }

  return `$${Math.round(volume).toLocaleString('en-US')} Vol.`;
}
