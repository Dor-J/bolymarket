'use client';

import { useAtomValue } from 'jotai';
import { tradeActivityForEventAtomFamily } from '@/lib/atoms/tradeActivity';
import {
  formatTradeSizeUsd,
  getTradeNotionalUsd,
} from '@/lib/featured/formatTradeActivity';
import { getOutcomeColor } from '@/lib/chart/colors';
import type { ChartOutcome } from '@/lib/chart/types';
import type { TradeActivityItem } from '@/lib/atoms/tradeActivity';
import type { Event } from '@/types/polymarket';
import { cn } from '@/lib/cn';

export interface FeaturedBidRailProps {
  event: Event;
  outcomes: ChartOutcome[];
  className?: string;
}

const MAX_VISIBLE_BIDS = 6;

function normalizeOutcomeName(value: string | undefined) {
  return value?.trim().toLowerCase() ?? '';
}

function getTradeColor(
  trade: TradeActivityItem,
  outcomes: ChartOutcome[],
): string {
  const outcomeName = normalizeOutcomeName(trade.outcome);
  const outcomeIndex = outcomes.findIndex(
    (outcome) => normalizeOutcomeName(outcome.name) === outcomeName,
  );

  if (outcomeIndex === -1) {
    return 'var(--text)';
  }

  return outcomes[outcomeIndex]?.color ?? getOutcomeColor(outcomeIndex);
}

/**
 * Vertical list of recent trade notionals between outcomes and the featured chart.
 */
export function FeaturedBidRail({
  event,
  outcomes,
  className,
}: FeaturedBidRailProps) {
  const trades = useAtomValue(tradeActivityForEventAtomFamily(event.slug));

  const bidItems = trades
    .map((trade) => {
      const size = getTradeNotionalUsd(trade);

      if (size === null) {
        return null;
      }

      return {
        id: trade.id,
        color: getTradeColor(trade, outcomes),
        size,
      };
    })
    .filter((item): item is { id: string; color: string; size: number } => item !== null)
    .slice(0, MAX_VISIBLE_BIDS)
    .reverse();

  if (bidItems.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'hidden h-[156px] w-16 shrink-0 flex-col justify-end gap-2 overflow-hidden py-1 lg:flex',
        className,
      )}
      aria-label="Recent trade sizes"
    >
      {bidItems.map((item) => (
        <p
          key={item.id}
          className="text-left text-sm leading-4 font-semibold tabular-nums text-text"
          style={{ color: item.color }}
        >
          {formatTradeSizeUsd(item.size)}
        </p>
      ))}
    </div>
  );
}
