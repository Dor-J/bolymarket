import type { TradeActivityItem } from '@/lib/atoms/tradeActivity';

export interface FetchTradeHistoryClientOptions {
  limit?: number;
  signal?: AbortSignal;
}

/**
 * Fetches recent event trades from the server API route.
 */
export async function fetchTradeHistoryClient(
  eventId: string,
  eventSlug: string,
  options: FetchTradeHistoryClientOptions = {},
): Promise<TradeActivityItem[]> {
  const params = new URLSearchParams({
    eventId,
    eventSlug,
  });

  if (options.limit) {
    params.set('limit', String(options.limit));
  }

  const response = await fetch(`/api/trades?${params.toString()}`, {
    headers: { Accept: 'application/json' },
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(
      `Trade history API error: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as TradeActivityItem[];
}
