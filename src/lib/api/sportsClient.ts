import type { SportsLiveResponse } from '@/types/polymarket';

export interface FetchSportsLiveClientOptions {
  signal?: AbortSignal;
}

/**
 * Fetches sports live games from the Redis-backed API route.
 */
export async function fetchSportsLiveClient(
  options: FetchSportsLiveClientOptions = {},
): Promise<SportsLiveResponse> {
  const response = await fetch('/api/sports/live', {
    headers: { Accept: 'application/json' },
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(
      `Sports live API error: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as SportsLiveResponse;
}
