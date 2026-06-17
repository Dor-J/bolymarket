import type { Event } from '@/types/polymarket';

/**
 * Builds a lowercase haystack from event fields for keyword matching.
 */
export function eventHaystack(event: Event): string {
  return [
    event.title,
    event.category ?? '',
    event.description ?? '',
    ...event.tags,
    ...event.markets.map((market) => market.question),
  ]
    .join(' ')
    .toLowerCase();
}

/**
 * Returns a matcher that checks if any keyword appears in the event haystack.
 */
export function createKeywordMatcher(
  keywords: readonly string[],
): (event: Event) => boolean {
  const normalized = keywords.map((keyword) => keyword.toLowerCase());

  return (event) => {
    const haystack = eventHaystack(event);
    return normalized.some((keyword) => haystack.includes(keyword));
  };
}

/**
 * Returns a matcher that requires all keywords to appear in the event haystack.
 */
export function createAllKeywordsMatcher(
  keywords: readonly string[],
): (event: Event) => boolean {
  const normalized = keywords.map((keyword) => keyword.toLowerCase());

  return (event) => {
    const haystack = eventHaystack(event);
    return normalized.every((keyword) => haystack.includes(keyword));
  };
}
