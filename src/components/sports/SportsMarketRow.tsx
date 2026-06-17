'use client';

import Link from 'next/link';
import { memo } from 'react';
import { PriceDisplay } from '@/components/market/PriceDisplay';
import { getYesNoFromMarket } from '@/lib/cards/mapEventToCardProps';
import type { Event } from '@/types/polymarket';
import { cn } from '@/lib/cn';

export interface SportsOddsCellProps {
  label: string;
  marketId: string;
  outcomeId: string;
  price: number;
  href: string;
  className?: string;
}

/**
 * Compact odds cell for sports live rows.
 */
export const SportsOddsCell = memo(function SportsOddsCell({
  label,
  marketId,
  outcomeId,
  price,
  href,
  className,
}: SportsOddsCellProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex min-w-[72px] flex-col items-center rounded-md border border-border bg-surface px-2 py-1.5',
        'transition-colors hover:bg-surface-2',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        className,
      )}
    >
      <span className="text-[10px] leading-3 font-w490 text-neutral-500">{label}</span>
      <PriceDisplay
        marketId={marketId}
        outcomeId={outcomeId}
        initialPrice={price}
        className="text-sm leading-5 font-semibold text-text"
      />
    </Link>
  );
});

export interface SportsMarketRowProps {
  event: Event;
}

/**
 * Sports live market row with moneyline-style odds cells.
 */
export const SportsMarketRow = memo(function SportsMarketRow({
  event,
}: SportsMarketRowProps) {
  const href = `/event/${event.slug}`;
  const market = event.markets[0];
  const { yesPrice, noPrice, yesOutcomeId } = market
    ? getYesNoFromMarket(market)
    : { yesPrice: 0, noPrice: 0, yesOutcomeId: '' };

  return (
    <div className="grid grid-cols-1 items-center gap-3 border-b border-border py-3 md:grid-cols-[1fr_auto]">
      <Link
        href={href}
        className="min-w-0 text-sm leading-5 font-semibold text-text hover:underline"
      >
        {event.title}
      </Link>

      <div className="flex items-center gap-2">
        <SportsOddsCell
          label="Yes"
          marketId={market?.id ?? ''}
          outcomeId={yesOutcomeId}
          price={yesPrice}
          href={href}
        />
        <SportsOddsCell
          label="No"
          marketId={market?.id ?? ''}
          outcomeId={yesOutcomeId}
          price={noPrice}
          href={href}
        />
      </div>
    </div>
  );
});
