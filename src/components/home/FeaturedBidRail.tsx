'use client';

import { useAtomValue } from 'jotai';
import { tradeActivityByEventAtom } from '@/lib/atoms/tradeActivity';
import {
  formatTradeSizeUsd,
  getTradeNotionalUsd,
} from '@/lib/featured/formatTradeActivity';
import type { Event } from '@/types/polymarket';
import { cn } from '@/lib/cn';

export interface FeaturedBidRailProps {
  event: Event;
  className?: string;
}

/**
 * Vertical list of recent trade notionals between outcomes and the featured chart.
 */
export function FeaturedBidRail({ event, className }: FeaturedBidRailProps) {
  const tradesByEvent = useAtomValue(tradeActivityByEventAtom);
  const trades = tradesByEvent[event.slug] ?? [];

  const bidSizes = trades
    .map((trade) => getTradeNotionalUsd(trade))
    .filter((value): value is number => value !== null)
    .slice(0, 8);

  if (bidSizes.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'hidden min-h-0 shrink-0 flex-col justify-center gap-3 py-2 lg:flex',
        className,
      )}
      aria-label="Recent trade sizes"
    >
      {bidSizes.map((size, index) => (
        <p
          key={`${size}-${index}`}
          className="text-right text-sm font-semibold tabular-nums text-text"
        >
          {formatTradeSizeUsd(size)}
        </p>
      ))}
    </div>
  );
}
