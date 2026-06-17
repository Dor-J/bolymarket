import type { TradeActivityItem } from '@/lib/atoms/tradeActivity';
import { formatCents } from '@/lib/format/price';

/**
 * Formats a trade notional size for the featured bid column (e.g. `$260`).
 */
export function formatTradeSizeUsd(size: number): string {
  if (!Number.isFinite(size) || size <= 0) {
    return '$0';
  }

  if (size >= 1_000) {
    return `$${Math.round(size).toLocaleString('en-US')}`;
  }

  return `$${Math.round(size)}`;
}

/**
 * Resolves the display notional for a trade (size is USDC on Polymarket activity).
 */
export function getTradeNotionalUsd(trade: TradeActivityItem): number | null {
  if (trade.size !== undefined && trade.size > 0) {
    return trade.size;
  }

  return null;
}

/**
 * Formats a live trade for the featured activity rail (pseudonym + outcome line).
 */
export function formatTradeActivityLine(trade: TradeActivityItem): {
  title: string;
  body: string;
} {
  const userName = trade.userName ?? 'Trader';
  const action = trade.side?.toUpperCase() === 'SELL' ? 'Sold' : 'Bought';
  const outcome = trade.outcome?.trim();

  if (outcome) {
    return {
      title: userName,
      body: `${action} ${outcome} at ${formatCents(trade.price)}`,
    };
  }

  return {
    title: userName,
    body: `${action} at ${formatCents(trade.price)}`,
  };
}
