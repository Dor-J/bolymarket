import { z } from 'zod';
import type { TradeActivityItem } from '@/lib/atoms/tradeActivity';

const DATA_API_BASE_URL = 'https://data-api.polymarket.com';
const DEFAULT_TRADE_LIMIT = 20;

const dataApiTradeSchema = z
  .object({
    proxyWallet: z.string().optional(),
    side: z.string().optional(),
    asset: z.string().optional(),
    asset_id: z.string().optional(),
    size: z.coerce.number().optional(),
    usdcSize: z.coerce.number().optional(),
    price: z.coerce.number(),
    timestamp: z.coerce.number(),
    eventSlug: z.string().optional(),
    event_slug: z.string().optional(),
    outcome: z.string().optional(),
    outcomeIndex: z.number().optional(),
    name: z.string().optional(),
    pseudonym: z.string().optional(),
    transactionHash: z.string().optional(),
  })
  .passthrough();

const dataApiTradesResponseSchema = z.array(dataApiTradeSchema);

export type DataApiTrade = z.infer<typeof dataApiTradeSchema>;

export interface FetchTradeHistoryOptions {
  limit?: number;
  signal?: AbortSignal;
}

function clampPrice(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

function normalizeTimestamp(timestamp: number): number {
  if (!Number.isFinite(timestamp)) {
    return Date.now();
  }

  return timestamp;
}

function normalizeSize(trade: DataApiTrade): number | undefined {
  const size = trade.size ?? trade.usdcSize;

  if (size !== undefined && Number.isFinite(size) && size > 0) {
    return size;
  }

  return undefined;
}

/**
 * Maps Polymarket Data API trades into the rail's shared trade activity shape.
 */
export function normalizeDataApiTrades(
  trades: DataApiTrade[],
  fallbackEventSlug: string,
): TradeActivityItem[] {
  return trades.map((trade, index) => {
    const timestamp = normalizeTimestamp(trade.timestamp);
    const assetId = trade.asset ?? trade.asset_id;
    const eventSlug = trade.eventSlug ?? trade.event_slug ?? fallbackEventSlug;

    return {
      id:
        trade.transactionHash ??
        `${eventSlug}-${timestamp}-${assetId ?? 'trade'}-${index}`,
      eventSlug,
      price: clampPrice(trade.price),
      side: trade.side,
      timestamp,
      assetId,
      size: normalizeSize(trade),
      outcome: trade.outcome,
      userName: trade.pseudonym ?? trade.name,
      transactionHash: trade.transactionHash,
    };
  });
}

/**
 * Fetches recent public trades for a Polymarket event from the Data API.
 */
export async function fetchTradeHistory(
  eventId: string,
  eventSlug: string,
  options: FetchTradeHistoryOptions = {},
): Promise<TradeActivityItem[]> {
  const limit = Math.max(1, Math.min(options.limit ?? DEFAULT_TRADE_LIMIT, 50));
  const params = new URLSearchParams({
    eventId,
    limit: String(limit),
  });

  const response = await fetch(
    `${DATA_API_BASE_URL}/trades?${params.toString()}`,
    {
      headers: { Accept: 'application/json' },
      signal: options.signal,
    },
  );

  if (!response.ok) {
    throw new Error(
      `Data API trades error: ${response.status} ${response.statusText}`,
    );
  }

  const trades = dataApiTradesResponseSchema.parse(await response.json());
  return normalizeDataApiTrades(trades, eventSlug);
}
