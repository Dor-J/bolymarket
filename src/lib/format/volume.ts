/**
 * Formats a USD volume number for display (e.g. "$2B Vol.", "$57M Vol.").
 */
export function formatVolume(volume: number): string {
  if (!Number.isFinite(volume) || volume <= 0) {
    return "$0 Vol.";
  }

  if (volume >= 1_000_000_000) {
    return `$${(volume / 1_000_000_000).toFixed(volume >= 10_000_000_000 ? 0 : 1)}B Vol.`;
  }

  if (volume >= 1_000_000) {
    return `$${(volume / 1_000_000).toFixed(volume >= 10_000_000 ? 0 : 1)}M Vol.`;
  }

  if (volume >= 1_000) {
    return `$${(volume / 1_000).toFixed(volume >= 10_000 ? 0 : 1)}K Vol.`;
  }

  return `$${Math.round(volume).toLocaleString()} Vol.`;
}
