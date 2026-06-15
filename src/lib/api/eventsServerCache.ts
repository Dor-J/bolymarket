import "server-only";

import type { Event } from "@/types/polymarket";
import {
  EVENTS_CACHE_TTL_MS,
  REDIS_EVENT_SLUG_PREFIX,
  REDIS_EVENTS_KEY,
} from '@/lib/cache/constants';
import { readServerCache, writeServerCache } from "@/lib/cache/serverCache";
import {
  fetchAggregatedOpenEvents,
  fetchEventBySlug,
} from "./gamma";

/**
 * Server-side: loads aggregated open events with Redis + memory cache.
 */
export async function getCachedAggregatedEvents(): Promise<Event[]> {
  const cached = await readServerCache<Event[]>(REDIS_EVENTS_KEY);
  if (cached) {
    return cached.data;
  }

  const events = await fetchAggregatedOpenEvents();
  await writeServerCache(REDIS_EVENTS_KEY, events, EVENTS_CACHE_TTL_MS);
  return events;
}

/**
 * Server-side: loads a single event by slug with Redis + memory cache.
 */
export async function getCachedEventBySlug(slug: string): Promise<Event | null> {
  const cacheKey = `${REDIS_EVENT_SLUG_PREFIX}${slug}`;
  const cached = await readServerCache<Event | null>(cacheKey);
  if (cached) {
    return cached.data;
  }

  const event = await fetchEventBySlug(slug);
  await writeServerCache(cacheKey, event, EVENTS_CACHE_TTL_MS);
  return event;
}
