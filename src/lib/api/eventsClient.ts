import type { Event } from '@/types/polymarket';

export interface FetchEventsClientOptions {
  signal?: AbortSignal;
}

/**
 * Fetches aggregated open events from the Redis-backed API route.
 */
export async function fetchEventsClient(
  options: FetchEventsClientOptions = {},
): Promise<Event[]> {
  const response = await fetch('/api/events', {
    headers: { Accept: 'application/json' },
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(
      `Events API error: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as Event[];
}

export interface FetchEventBySlugClientOptions {
  signal?: AbortSignal;
}

/**
 * Fetches a single event by slug from the Redis-backed API route.
 */
export async function fetchEventBySlugClient(
  slug: string,
  options: FetchEventBySlugClientOptions = {},
): Promise<Event | null> {
  const response = await fetch(`/api/events/${encodeURIComponent(slug)}`, {
    headers: { Accept: 'application/json' },
    signal: options.signal,
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Event API error: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as Event | null;
}
