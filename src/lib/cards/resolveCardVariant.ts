import type { Event } from '@/types/polymarket';
import { eventHaystack } from '@/lib/markets/topicMatchers';

export type CardVariant =
  | 'binary'
  | 'multi-outcome'
  | 'crypto-up-down'
  | 'crypto-price-target'
  | 'sports-match';

/**
 * Determines which card variant to render for an event.
 */
export function resolveCardVariant(event: Event): CardVariant {
  const haystack = eventHaystack(event);
  const market = event.markets[0];
  const outcomeNames = market?.outcomes.map((outcome) => outcome.name.toLowerCase()) ?? [];
  const isYesNo =
    outcomeNames.length === 2 &&
    outcomeNames.includes('yes') &&
    outcomeNames.includes('no');

  if (
    event.markets.length === 1 &&
    market &&
    market.outcomes.length >= 2 &&
    market.outcomes.length <= 3 &&
    !isYesNo &&
    /sports|soccer|fifwc|mlb|nba|nfl|nhl|tennis|cs2|esports/.test(haystack) &&
    (/\bvs\.?\b|\bv\b|game \d+|fifwc-/.test(haystack) ||
      outcomeNames.some((name) => name === 'draw'))
  ) {
    return 'sports-match';
  }

  if (/up or down|up\/down|updown/.test(haystack) && event.markets.length === 1) {
    return 'crypto-up-down';
  }

  if (/hit|reach|price will|above|below|price range/.test(haystack)) {
    return 'crypto-price-target';
  }

  if (event.markets.length === 1) {
    if (market && market.outcomes.length === 2) {
      return 'binary';
    }
  }

  return 'multi-outcome';
}
