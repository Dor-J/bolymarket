import type { Event } from "@/types/polymarket";
import { normalizeEvents } from "./normalize";
import { gammaEventsResponseSchema } from "./schemas";

const GAMMA_API_BASE = "https://gamma-api.polymarket.com";

export interface FetchOpenEventsOptions {
  /** Maximum number of events to request. */
  limit?: number;
  /** Abort signal for request cancellation. */
  signal?: AbortSignal;
}

/**
 * Fetches open events from the Polymarket Gamma API and returns normalized data.
 */
export async function fetchOpenEvents(
  options: FetchOpenEventsOptions = {},
): Promise<Event[]> {
  const params = new URLSearchParams({ closed: "false" });

  if (options.limit !== undefined) {
    params.set("limit", String(options.limit));
  }

  const response = await fetch(
    `${GAMMA_API_BASE}/events?${params.toString()}`,
    {
      headers: { Accept: "application/json" },
      signal: options.signal,
      next: { revalidate: 60 },
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
      headers: { Accept: "application/json" },
      signal: options.signal,
      next: { revalidate: 60 },
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
