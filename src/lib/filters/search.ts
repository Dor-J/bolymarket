import type { Event } from '@/types/polymarket';

/**
 * Returns whether an event matches a free-text search query.
 * Empty or whitespace-only queries match all events.
 */
export function eventMatchesSearch(event: Event, query: string): boolean {
  const needle = query.trim().toLowerCase();

  if (!needle) {
    return true;
  }

  if (event.title.toLowerCase().includes(needle)) {
    return true;
  }

  if (event.slug.toLowerCase().includes(needle)) {
    return true;
  }

  if (event.category?.toLowerCase().includes(needle)) {
    return true;
  }

  if (event.tags.some((tag) => tag.toLowerCase().includes(needle))) {
    return true;
  }

  return event.markets.some((market) =>
    market.question.toLowerCase().includes(needle),
  );
}

/**
 * Filters events by search query while preserving input order.
 */
export function filterEventsBySearch(events: Event[], query: string): Event[] {
  return events.filter((event) => eventMatchesSearch(event, query));
}
