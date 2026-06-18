'use client';

import Link from 'next/link';
import { MarketThumbnail } from '@/components/market/MarketThumbnail';
import { PriceDisplay } from '@/components/market/PriceDisplay';
import { formatPercent } from '@/lib/format/price';
import { resolveCardVariant } from '@/lib/cards/resolveCardVariant';
import {
  getTopOutcomeRows,
  mapEventToBinaryProps,
} from '@/lib/cards/mapEventToCardProps';
import type { Event } from '@/types/polymarket';
import { cn } from '@/lib/cn';

export interface FeaturedOutcomeRowsProps {
  event: Event;
  className?: string;
}

/**
 * Top outcome rows for the featured event preview card.
 */
export function FeaturedOutcomeRows({
  event,
  className,
}: FeaturedOutcomeRowsProps) {
  const variant = resolveCardVariant(event);

  if (variant === 'binary') {
    const props = mapEventToBinaryProps(event);

    return (
      <div className={cn('rounded-lg', className)}>
        <div className="flex min-h-10 items-center justify-between gap-3 border-b border-neutral-50 pb-2">
          <p className="text-[15px] font-w490 tracking-[-0.01em] text-text">
            Yes
          </p>
          <PriceDisplay
            marketId={props.marketId}
            outcomeId={props.yesOutcomeId}
            initialPrice={props.yesPrice}
            className="text-xl font-semibold text-text"
          />
        </div>
        <div className="flex min-h-10 items-center justify-between gap-3 pt-2">
          <p className="text-[15px] font-w490 tracking-[-0.01em] text-text">
            No
          </p>
          <span className="text-xl font-semibold text-text">
            {formatPercent(props.noPrice)}
          </span>
        </div>
      </div>
    );
  }

  const rows = getTopOutcomeRows(event, 4);

  return (
    <div className={cn('rounded-lg flex flex-col gap-2', className)}>
      {rows.map((row) => (
        <Link
          key={`${row.marketId}-${row.outcomeId}`}
          href={`/event/${event.slug}`}
          className="group flex min-h-10 items-center justify-between gap-3 border-b border-neutral-50 pb-2"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="shrink-0">
              <MarketThumbnail
                title={row.name}
                image={row.image ?? event.image}
                size={30}
                className="rounded-[2px]"
              />
            </div>
            <div className="flex min-w-0 items-center gap-1.5">
              <p className="truncate text-[15px] font-w490 tracking-[-0.01em] text-text group-hover:underline">
                {row.name}
              </p>
            </div>
          </div>
          <PriceDisplay
            marketId={row.marketId}
            outcomeId={row.outcomeId}
            initialPrice={row.yesPrice}
            className="text-heading-xl font-semibold text-text"
          />
        </Link>
      ))}
    </div>
  );
}
