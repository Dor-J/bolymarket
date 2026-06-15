import type { Event } from '@/types/polymarket';

export type CardVariant = 'binary' | 'multi-outcome';

/**
 * Determines which card variant to render for an event.
 */
export function resolveCardVariant(event: Event): CardVariant {
  if (event.markets.length === 1) {
    const market = event.markets[0];

    if (market && market.outcomes.length === 2) {
      return 'binary';
    }
  }

  return 'multi-outcome';
}
