'use client';

import { useAtomValue } from 'jotai';
import { marketPriceAtomFamily } from '@/lib/atoms/prices';
import { formatCents, formatPercent } from '@/lib/format/price';
import { cn } from '@/lib/cn';

export interface PriceDisplayProps {
  marketId: string;
  outcomeId: string;
  initialPrice: number;
  format?: 'percent' | 'cents';
  className?: string;
}

/**
 * Leaf price display — subscribes to per-market price atoms when seeded (Phase 4).
 */
export function PriceDisplay({
  marketId,
  outcomeId,
  initialPrice,
  format = 'percent',
  className,
}: PriceDisplayProps) {
  const livePrice = useAtomValue(marketPriceAtomFamily(marketId));
  const price = livePrice?.value ?? initialPrice;
  const formatted =
    format === 'cents' ? formatCents(price) : formatPercent(price);

  return (
    <span
      className={cn('price-text tabular-nums', className)}
      data-price={outcomeId}
    >
      {formatted}
    </span>
  );
}
