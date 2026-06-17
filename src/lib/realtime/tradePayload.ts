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
}

/**
 * Parses a WebSocket trade payload into a normalized shape.
 */
export function parseTradePayload(payload: object): TradePayload | null {
  const record = payload as Record<string, unknown>;
  const price = Number(record.price);

  if (!Number.isFinite(price)) {
    return null;
  }

  const size = Number(record.size);
  const timestamp = Number(record.timestamp);

  return {
    asset: typeof record.asset === "string" ? record.asset : undefined,
    price,
    eventSlug:
      typeof record.eventSlug === "string" ? record.eventSlug : undefined,
    slug: typeof record.slug === "string" ? record.slug : undefined,
    outcomeIndex:
      typeof record.outcomeIndex === "number"
        ? record.outcomeIndex
        : undefined,
    side: typeof record.side === "string" ? record.side : undefined,
    size: Number.isFinite(size) && size > 0 ? size : undefined,
    outcome: typeof record.outcome === "string" ? record.outcome : undefined,
    userName:
      typeof record.pseudonym === "string"
        ? record.pseudonym
        : typeof record.name === "string"
          ? record.name
          : undefined,
    timestamp: Number.isFinite(timestamp) ? timestamp : undefined,
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
