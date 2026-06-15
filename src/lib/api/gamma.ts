import {
  GAMMA_CATEGORY_TAG_SLUGS,
  GAMMA_EVENTS_ORDER,
  GAMMA_EVENTS_PAGE_LIMIT,
} from "@/lib/constants/gamma";
import type { Event } from "@/types/polymarket";
import { normalizeEvents } from "./normalize";
import { gammaEventsResponseSchema } from "./schemas";

const GAMMA_API_BASE = "https://gamma-api.polymarket.com";

export interface FetchOpenEventsOptions {
  /** Maximum number of events to request. */
  limit?: number;
  /** Filter by tag slug (e.g. crypto, sports, politics). */
  tagSlug?: string;
  /** Include related tags when filtering by tag slug. */
  relatedTags?: boolean;
  /** Sort field passed to Gamma `order`. */
  order?: string;
  /** Abort signal for request cancellation. */
  signal?: AbortSignal;
}

async function fetchGammaEvents(
  params: URLSearchParams,
  signal?: AbortSignal,
): Promise<Event[]> {
  const response = await fetch(
    `${GAMMA_API_BASE}/events?${params.toString()}`,
    {
      headers: { Accept: 'application/json' },
      signal,
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error(
      `Gamma API error: ${response.status} ${response.statusText}`,
    );
  }

  const json: unknown = await response.json();
  const parsed = gammaEventsResponseSchema.parse(json);

  return normalizeEvents(parsed);
}

function buildEventsParams(options: FetchOpenEventsOptions): URLSearchParams {
  const params = new URLSearchParams({
    closed: "false",
    active: "true",
    order: options.order ?? GAMMA_EVENTS_ORDER,
    ascending: "false",
  });

  if (options.limit !== undefined) {
    params.set("limit", String(options.limit));
  }

  if (options.tagSlug) {
    params.set("tag_slug", options.tagSlug);
  }

  if (options.relatedTags) {
    params.set("related_tags", "true");
  }

  return params;
}

/**
 * Fetches open events from the Polymarket Gamma API and returns normalized data.
 */
export async function fetchOpenEvents(
  options: FetchOpenEventsOptions = {},
): Promise<Event[]> {
  return fetchGammaEvents(buildEventsParams(options), options.signal);
}

/**
 * Merges event arrays by id, keeping the highest-volume copy per event.
 */
export function mergeEventsById(...groups: Event[][]): Event[] {
  const byId = new Map<string, Event>();

  for (const group of groups) {
    for (const event of group) {
      const existing = byId.get(event.id);
      if (!existing || event.volume > existing.volume) {
        byId.set(event.id, event);
      }
    }
  }

  return Array.from(byId.values()).sort((left, right) => {
    if (right.volume !== left.volume) {
      return right.volume - left.volume;
    }

    return left.title.localeCompare(right.title);
  });
}

/**
 * Fetches trending plus Crypto, Sports, and Politics events for richer category data.
 */
export async function fetchAggregatedOpenEvents(
  options: { signal?: AbortSignal } = {},
): Promise<Event[]> {
  const limit = GAMMA_EVENTS_PAGE_LIMIT;
  const requests = [
    fetchOpenEvents({ limit, signal: options.signal }),
    ...GAMMA_CATEGORY_TAG_SLUGS.map((tagSlug) =>
      fetchOpenEvents({
        limit,
        tagSlug,
        relatedTags: true,
        signal: options.signal,
      }),
    ),
  ];

  const results = await Promise.all(requests);
  return mergeEventsById(...results);
}

/** Alias used by React Query helpers. */
export const getOpenEvents = fetchOpenEvents;

export interface FetchEventBySlugOptions {
  /** Abort signal for request cancellation. */
  signal?: AbortSignal;
}

/**
 * Fetches a single event by slug from the Gamma API.
 * Returns null when no matching event exists.
 */
export async function fetchEventBySlug(
  slug: string,
  options: FetchEventBySlugOptions = {},
): Promise<Event | null> {
  const params = new URLSearchParams({
    slug,
    closed: "false",
  });

  const response = await fetch(
    `${GAMMA_API_BASE}/events?${params.toString()}`,
    {
      headers: { Accept: 'application/json' },
      signal: options.signal,
      cache: 'no-store',
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Gamma API error: ${response.status} ${response.statusText}`,
    );
  }

  const json: unknown = await response.json();
  const parsed = gammaEventsResponseSchema.parse(json);
  const events = normalizeEvents(parsed);

  return events.find((event) => event.slug === slug) ?? events[0] ?? null;
}
