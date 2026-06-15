import type { Event } from "@/types/polymarket";
import {
  EVENTS_CACHE_TTL_MS,
  LOCAL_EVENT_SLUG_PREFIX,
  LOCAL_EVENTS_CACHE_KEY,
} from "@/lib/cache/constants";
import { readLocalCache, writeLocalCache } from "@/lib/cache/localStorage";

function getLocalEventKey(slug: string): string {
  return `${LOCAL_EVENT_SLUG_PREFIX}${slug}`;
}

export interface FetchEventsClientOptions {
  signal?: AbortSignal;
}

/**
 * Browser: reads localStorage first, then `/api/events` (Redis-backed on server).
 */
export async function fetchEventsClient(
  options: FetchEventsClientOptions = {},
): Promise<Event[]> {
  const local = readLocalCache<Event[]>(LOCAL_EVENTS_CACHE_KEY);
  if (local) {
    return local.data;
  }

  const response = await fetch("/api/events", {
    headers: { Accept: "application/json" },
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(
      `Events API error: ${response.status} ${response.statusText}`,
    );
  }

  const events = (await response.json()) as Event[];
  writeLocalCache(LOCAL_EVENTS_CACHE_KEY, events, EVENTS_CACHE_TTL_MS);
  return events;
}

export interface FetchEventBySlugClientOptions {
  signal?: AbortSignal;
}

/**
 * Browser: reads localStorage first, then `/api/events/[slug]`.
 */
export async function fetchEventBySlugClient(
  slug: string,
  options: FetchEventBySlugClientOptions = {},
): Promise<Event | null> {
  const localKey = getLocalEventKey(slug);
  const local = readLocalCache<Event | null>(localKey);
  if (local) {
    return local.data;
  }

  const response = await fetch(`/api/events/${encodeURIComponent(slug)}`, {
    headers: { Accept: "application/json" },
    signal: options.signal,
  });

  if (response.status === 404) {
    writeLocalCache(localKey, null, EVENTS_CACHE_TTL_MS);
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Event API error: ${response.status} ${response.statusText}`,
    );
  }

  const event = (await response.json()) as Event | null;
  writeLocalCache(localKey, event, EVENTS_CACHE_TTL_MS);
  return event;
}
