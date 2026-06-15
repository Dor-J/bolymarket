'use client';

import { useAtomValue } from 'jotai';
import { marketPriceAtomFamily } from '@/lib/atoms/prices';
import { cn } from '@/lib/cn';

export interface ProbabilityBarProps {
  marketId: string;
  yesPrice: number;
  className?: string;
}

/**
 * Horizontal probability bar for binary market cards (§12.3).
 */
export function ProbabilityBar({
  marketId,
  yesPrice,
  className,
}: ProbabilityBarProps) {
  const livePrice = useAtomValue(marketPriceAtomFamily(marketId));
  const price = livePrice?.value ?? yesPrice;
  const yesPercent = Math.min(100, Math.max(0, price * 100));
  const noPercent = 100 - yesPercent;

  return (
    <div
      className={cn(
        'flex h-2 w-full overflow-hidden rounded-full bg-surface-2',
        className,
      )}
      role="presentation"
      aria-hidden
    >
      <div
        className="h-full bg-yes transition-[width] duration-300 ease-out"
        style={{ width: `${yesPercent}%` }}
      />
      <div
        className="h-full bg-no transition-[width] duration-300 ease-out"
        style={{ width: `${noPercent}%` }}
      />
    </div>
  );
}
