/** Server-side Redis key for the aggregated open events list. */
export const REDIS_EVENTS_KEY = "bolymarket:events:open";

/** Server-side Redis key prefix for single events. */
export const REDIS_EVENT_SLUG_PREFIX = "bolymarket:event:";

/** Default TTL for events cache (1 minute). */
export const EVENTS_CACHE_TTL_MS = 60_000;

/** localStorage key for the client-side events cache. */
export const LOCAL_EVENTS_CACHE_KEY = "bolymarket.events.v1";

/** localStorage key for a single event by slug. */
export const LOCAL_EVENT_SLUG_PREFIX = "bolymarket.event.";
