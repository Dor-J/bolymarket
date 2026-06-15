'use client';

import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { MarketThumbnail } from '@/components/market/MarketThumbnail';
import { PriceDisplay } from '@/components/market/PriceDisplay';
import { YesNoChip } from '@/components/market/YesNoChip';
import { formatVolume } from '@/lib/format/volume';
import type { MultiOutcomeCardProps } from '@/lib/cards/types';
import { cn } from '@/lib/cn';

const cardShellClasses = cn(
  'group flex min-h-[180px] flex-col rounded-card border border-[#e6e8ea] bg-card pt-3',
  'transition-colors hover:border-[#caced3] hover:bg-surface-2',
  'focus-within:ring-2 focus-within:ring-ring focus-within:outline-none',
);

/**
 * Multi-outcome market card — top two outcomes with Yes/No chips (§12.1).
 */
export const MultiOutcomeCard = memo(function MultiOutcomeCard({
  slug,
  title,
  image,
  volume,
  outcomes,
}: MultiOutcomeCardProps) {
  return (
    <Link href={`/event/${slug}`} className={cn(cardShellClasses, 'px-3 pb-3')}>
      <div className="flex items-start gap-2">
        <MarketThumbnail title={title} image={image} />
        <h3 className="line-clamp-2 min-w-0 flex-1 text-sm leading-5 font-semibold text-text">
          {title}
        </h3>
        <ExternalLink
          className="h-4 w-4 shrink-0 text-[#aeb4bc] opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden
        />
      </div>

      <div className="mt-2 flex flex-col gap-2">
        {outcomes.map((outcome) => (
          <div
            key={`${outcome.marketId}-${outcome.outcomeId}`}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-x-2 gap-y-1"
          >
            <span className="truncate text-sm leading-5 font-medium text-[#0e0f11]">
              {outcome.name}
            </span>
            <PriceDisplay
              marketId={outcome.marketId}
              outcomeId={outcome.outcomeId}
              initialPrice={outcome.yesPrice}
              className="text-[15px] leading-[22.5px] font-semibold text-[#0e0f11]"
            />
            <div className="flex items-center gap-1">
              <YesNoChip
                side="yes"
                price={outcome.yesPrice}
                marketId={outcome.marketId}
                outcomeId={outcome.outcomeId}
              />
              <YesNoChip
                side="no"
                price={outcome.noPrice}
                marketId={outcome.marketId}
                outcomeId={outcome.outcomeId}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-3">
        <p className="text-[13px] leading-4 font-medium text-[#aeb4bc]">
          {formatVolume(volume)}
        </p>
        <BookmarkButton />
      </div>
    </Link>
  );
});
