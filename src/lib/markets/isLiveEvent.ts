import type { Event } from '@/types/polymarket';
import { eventHaystack } from './topicMatchers';

/**
 * Heuristic for whether an event should show a Live badge.
 */
export function isLiveEvent(event: Event): boolean {
  const haystack = eventHaystack(event);

  if (/up or down|up\/down|updown|5 min|15 min|1 hour|4 hour|live/.test(haystack)) {
    return true;
  }

  if (event.endDate) {
    const end = Date.parse(event.endDate);
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    if (!Number.isNaN(end) && end > now && end - now < dayMs) {
      return true;
    }
  }

  return false;
}

/**
 * Extracts a compact asset label for crypto cards.
 */
export function getCryptoAssetLabel(event: Event): string | null {
  const haystack = eventHaystack(event);

  if (/\bbitcoin\b|\bbtc\b/.test(haystack)) {
    return 'Bitcoin';
  }

  if (/\bethereum\b|\beth\b/.test(haystack)) {
    return 'Ethereum';
  }

  if (/\bsolana\b|\bsol\b/.test(haystack)) {
    return 'Solana';
  }

  if (/\bxrp\b/.test(haystack)) {
    return 'XRP';
  }

  if (/\bdogecoin\b|\bdoge\b/.test(haystack)) {
    return 'Dogecoin';
  }

  return null;
}
