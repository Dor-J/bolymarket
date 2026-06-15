'use client';

import { PriceDisplay } from '@/components/market/PriceDisplay';
import type { ChartOutcome } from '@/lib/chart/types';
import { cn } from '@/lib/cn';

export interface OutcomeLegendProps {
  outcomes: ChartOutcome[];
  className?: string;
}

/**
 * Horizontal legend for chart outcome lines (§16.2).
 */
export function OutcomeLegend({ outcomes, className }: OutcomeLegendProps) {
  if (outcomes.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-x-4 gap-y-2', className)}>
      {outcomes.map((outcome) => (
        <div
          key={outcome.id}
          className="inline-flex items-center gap-2 text-sm leading-5 text-text"
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: outcome.color }}
            aria-hidden
          />
          <span>{outcome.name}</span>
          <PriceDisplay
            marketId={outcome.marketId}
            outcomeId={outcome.id}
            initialPrice={outcome.price}
            className="font-semibold"
          />
        </div>
      ))}
    </div>
  );
}
