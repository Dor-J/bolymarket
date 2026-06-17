import type { Event } from '@/types/polymarket';
import { eventHaystack } from '@/lib/markets/topicMatchers';

export type EventDetailVariant =
  | 'standard'
  | 'crypto-recurring'
  | 'crypto-price-target'
  | 'sports-match';

/**
 * Selects the event detail layout variant for an event.
 */
export function resolveEventDetailVariant(event: Event): EventDetailVariant {
  const haystack = eventHaystack(event);

  if (/vs\.| vs |fifwc|match|game \d|mlb|nba|nfl|nhl|atp|wta/.test(haystack)) {
    return 'sports-match';
  }

  if (/up or down|up\/down|updown|5 min|15 min/.test(haystack)) {
    return 'crypto-recurring';
  }

  if (/hit|reach|price will|above|below|price range/.test(haystack)) {
    return 'crypto-price-target';
  }

  return 'standard';
}
