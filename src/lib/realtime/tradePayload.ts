/** Trade payload from Polymarket `activity` WebSocket topic. */
export interface TradePayload {
  asset?: string;
  price?: number;
  eventSlug?: string;
  slug?: string;
  outcomeIndex?: number;
  side?: string;
  size?: number;
  outcome?: string;
  userName?: string;
  timestamp?: number;
  transactionHash?: string;
}

function getString(record: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string') {
      return value;
    }
  }

  return undefined;
}

function getNumber(record: Record<string, unknown>, ...keys: string[]): number {
  for (const key of keys) {
    const value = Number(record[key]);
    if (Number.isFinite(value)) {
      return value;
    }
  }

  return Number.NaN;
}

/**
 * Parses a WebSocket trade payload into a normalized shape.
 */
export function parseTradePayload(payload: object): TradePayload | null {
  const record = payload as Record<string, unknown>;
  const price = getNumber(record, 'price');

  if (!Number.isFinite(price)) {
    return null;
  }

  const size = getNumber(record, 'size', 'usdcSize');
  const timestamp = getNumber(record, 'timestamp');

  return {
    asset: getString(record, 'asset', 'asset_id'),
    price,
    eventSlug:
      getString(record, 'eventSlug', 'event_slug'),
    slug: getString(record, 'slug'),
    outcomeIndex:
      typeof record.outcomeIndex === "number"
        ? record.outcomeIndex
        : undefined,
    side: getString(record, 'side'),
    size: Number.isFinite(size) && size > 0 ? size : undefined,
    outcome: getString(record, 'outcome'),
    userName: getString(record, 'pseudonym', 'name'),
    timestamp: Number.isFinite(timestamp) ? timestamp : undefined,
    transactionHash: getString(record, 'transactionHash', 'transaction_hash'),
  };
}

/**
 * Clamps a live trade price to the valid probability range.
 */
export function clampTradePrice(price: number): number {
  if (!Number.isFinite(price)) {
    return 0;
  }

  return Math.min(1, Math.max(0, price));
}
