'use client';

import { useAtomValue } from 'jotai';
import { outcomePriceAtomFamily } from '@/lib/atoms/prices';
import { formatCents, formatPercent } from '@/lib/format/price';
import { getOutcomePriceKey } from '@/lib/prices/outcomeKey';
import { usePriceFlash } from '@/hooks/usePriceFlash';
import { cn } from '@/lib/cn';

export interface PriceDisplayProps {
  marketId: string;
  outcomeId: string;
  initialPrice: number;
  format?: 'percent' | 'cents';
  side?: 'yes' | 'no';
  className?: string;
  enableFlash?: boolean;
}

/**
 * Leaf price display — subscribes to per-outcome price atoms.
 */
export function PriceDisplay({
  marketId,
  outcomeId,
  initialPrice,
  format = 'percent',
  side = 'yes',
  className,
  enableFlash = true,
}: PriceDisplayProps) {
  const outcomeKey = getOutcomePriceKey(marketId, outcomeId);
  const livePrice = useAtomValue(outcomePriceAtomFamily(outcomeKey));
  const yesValue = livePrice?.value ?? initialPrice;
  const yesPrevious = livePrice?.previousValue ?? initialPrice;
  const displayValue = side === 'no' ? Math.max(0, 1 - yesValue) : yesValue;
  const displayPrevious =
    side === 'no' ? Math.max(0, 1 - yesPrevious) : yesPrevious;
  const formatted =
    format === 'cents'
      ? formatCents(displayValue)
      : formatPercent(displayValue);

  const { flashClassName } = usePriceFlash(
    displayValue,
    displayPrevious,
    enableFlash ? livePrice?.updatedAt : undefined,
  );

  return (
    <span
      key={enableFlash ? livePrice?.updatedAt : undefined}
      className={cn('price-text tabular-nums', flashClassName, className)}
      data-price={outcomeId}
      aria-live="off"
    >
      {formatted}
    </span>
  );
}
