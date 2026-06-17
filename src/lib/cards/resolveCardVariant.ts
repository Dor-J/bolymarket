import type { Event } from '@/types/polymarket';
import { eventHaystack } from '@/lib/markets/topicMatchers';

export type CardVariant =
  | 'binary'
  | 'multi-outcome'
  | 'crypto-up-down'
  | 'crypto-price-target';

/**
 * Determines which card variant to render for an event.
 */
export function resolveCardVariant(event: Event): CardVariant {
  const haystack = eventHaystack(event);

  if (/up or down|up\/down|updown/.test(haystack) && event.markets.length === 1) {
    return 'crypto-up-down';
  }

  if (/hit|reach|price will|above|below|price range/.test(haystack)) {
    return 'crypto-price-target';
  }

  if (event.markets.length === 1) {
    const market = event.markets[0];

    if (market && market.outcomes.length === 2) {
      return 'binary';
    }
  }

  return 'multi-outcome';
}
