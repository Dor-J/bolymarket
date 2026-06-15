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
