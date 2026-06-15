'use client';

import { memo } from 'react';
import { MarketThumbnail } from '@/components/market/MarketThumbnail';
import { PriceDisplay } from '@/components/market/PriceDisplay';
import { ProbabilityBar } from '@/components/market/ProbabilityBar';
import { formatCents } from '@/lib/format/price';
import { formatDetailVolume } from '@/lib/format/detailVolume';
import { cn } from '@/lib/cn';

export interface OutcomeRowProps {
  marketId: string;
  outcomeId: string;
  name: string;
  volume: number;
  yesPrice: number;
  noPrice: number;
  image?: string;
}

/**
 * Single outcome row with probability bar and visual-only Buy buttons (§16.4).
 */
export const OutcomeRow = memo(function OutcomeRow({
  marketId,
  outcomeId,
  name,
  volume,
  yesPrice,
  noPrice,
  image,
}: OutcomeRowProps) {
  return (
    <article className="border-b border-border py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <MarketThumbnail title={name} image={image} size={32} />
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="truncate text-base leading-4 font-medium text-text">
              {name}
            </h3>
            <p className="text-[13px] leading-4 font-medium text-[#aeb4bc]">
              {formatDetailVolume(volume)}
            </p>
          </div>
        </div>

        <PriceDisplay
          marketId={marketId}
          outcomeId={outcomeId}
          initialPrice={yesPrice}
          className="text-[28px] leading-7 font-semibold text-[#0e0f11]"
        />
      </div>

      <ProbabilityBar
        marketId={marketId}
        yesPrice={yesPrice}
        className="mt-3"
      />

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled
          className={cn(
            'inline-flex h-12 min-w-[136px] flex-1 items-center justify-center rounded-[7.2px]',
            'bg-yes text-sm leading-5 font-semibold text-white opacity-100',
          )}
        >
          Buy Yes {formatCents(yesPrice)}
        </button>
        <button
          type="button"
          disabled
          className={cn(
            'inline-flex h-12 min-w-[136px] flex-1 items-center justify-center rounded-[7.2px]',
            'bg-no/10 text-sm leading-5 font-semibold text-no',
          )}
        >
          Buy No {formatCents(noPrice)}
        </button>
      </div>
    </article>
  );
});
