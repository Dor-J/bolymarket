/**
 * Formats sports row volume like Polymarket (`$836.18K Vol`, `$1.24M Vol`).
 */
export function formatSportsVolume(volume: number): string {
  if (!Number.isFinite(volume) || volume <= 0) {
    return '$0 Vol';
  }

  if (volume >= 1_000_000_000) {
    const value = volume / 1_000_000_000;
    return `$${trimTrailingZeros(value.toFixed(2))}B Vol`;
  }

  if (volume >= 1_000_000) {
    const value = volume / 1_000_000;
    return `$${trimTrailingZeros(value.toFixed(2))}M Vol`;
  }

  if (volume >= 1_000) {
    const value = volume / 1_000;
    return `$${trimTrailingZeros(value.toFixed(2))}K Vol`;
  }

  return `$${Math.round(volume)} Vol`;
}

function trimTrailingZeros(value: string): string {
  return value.replace(/\.?0+$/, '');
}
