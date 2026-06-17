"use client";

import Link from "next/link";
import { memo } from "react";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { LiveBadge } from "@/components/markets/LiveBadge";
import { MarketThumbnail } from "@/components/market/MarketThumbnail";
import { PriceDisplay } from "@/components/market/PriceDisplay";
import { YesNoChip } from "@/components/market/YesNoChip";
import type { CryptoPriceTargetCardProps } from "@/lib/cards/cryptoCardTypes";
import { formatVolume } from "@/lib/format/volume";
import { cn } from "@/lib/cn";

const cardShellClasses = cn(
  "group relative flex min-h-[180px] flex-col rounded-card border border-neutral-100 bg-card px-3 pb-3 pt-3",
  "transition-colors duration-200 hover:border-neutral-200 hover:bg-surface-2",
  "focus-within:ring-2 focus-within:ring-ring focus-within:outline-none",
);

/**
 * Crypto price-target card with threshold rows and asset metadata.
 */
export const CryptoPriceTargetCard = memo(function CryptoPriceTargetCard({
  slug,
  title,
  image,
  volume,
  outcomes,
  assetLabel,
  isLive,
}: CryptoPriceTargetCardProps) {
  const href = `/event/${slug}`;

  return (
    <article className={cardShellClasses}>
      <Link href={href} className="absolute inset-0 z-0 rounded-card" aria-label={title} />

      <div className="relative z-10 pointer-events-none flex flex-col h-full">
        <div className="flex items-start gap-2">
          <MarketThumbnail title={title} image={image} />
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-sm leading-5 font-w590 text-text">
              {title}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
              {isLive ? <LiveBadge /> : null}
              {assetLabel ? <span>· {assetLabel}</span> : null}
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          {outcomes.map((outcome) => (
            <div
              key={`${outcome.marketId}-${outcome.outcomeId}`}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-x-2"
            >
              <span className="truncate text-sm leading-5 font-w440 text-neutral-950">
                {outcome.name}
              </span>
              <PriceDisplay
                marketId={outcome.marketId}
                outcomeId={outcome.outcomeId}
                initialPrice={outcome.yesPrice}
                className="text-[15px] leading-[22.5px] font-semibold text-neutral-950"
              />
              <div className="flex items-center gap-1 pointer-events-auto">
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

        <div className="mt-auto flex items-center justify-between pt-3 pointer-events-auto">
          <p className="text-[13px] leading-4 font-w490 text-neutral-300">
            {formatVolume(volume)}
          </p>
          <BookmarkButton slug={slug} />
        </div>
      </div>
    </article>
  );
});
