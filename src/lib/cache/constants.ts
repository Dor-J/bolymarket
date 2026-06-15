/** Server-side Redis key for the aggregated open events list. */
export const REDIS_EVENTS_KEY = "bolymarket:events:open";

/** Server-side Redis key prefix for single events. */
export const REDIS_EVENT_SLUG_PREFIX = "bolymarket:event:";

/** Default TTL for events cache (1 minute). */
export const EVENTS_CACHE_TTL_MS = 60_000;

/** IndexedDB key for persisted React Query cache. */
export const QUERY_PERSIST_KEY = 'bolymarket-query-cache';

/** Buster string — bump when Event shape changes to invalidate IDB cache. */
export const QUERY_PERSIST_BUSTER = 'v2';

/** Max age for persisted client cache (24 hours). */
export const QUERY_PERSIST_MAX_AGE_MS = 24 * 60 * 60_000;
