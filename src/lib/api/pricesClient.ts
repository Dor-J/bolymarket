import type { ChartPoint, Timeframe } from '@/lib/chart/types';

export interface FetchPriceHistoryClientOptions {
  signal?: AbortSignal;
}

/**
 * Fetches cached CLOB price history from the server API route.
 */
export async function fetchPriceHistoryClient(
  tokenId: string,
  timeframe: Timeframe,
  options: FetchPriceHistoryClientOptions = {},
): Promise<ChartPoint[]> {
  const params = new URLSearchParams({ timeframe });
  const response = await fetch(
    `/api/prices/${encodeURIComponent(tokenId)}?${params.toString()}`,
    {
      headers: { Accept: 'application/json' },
      signal: options.signal,
    },
  );

  if (!response.ok) {
    throw new Error(
      `Price history API error: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as ChartPoint[];
}
