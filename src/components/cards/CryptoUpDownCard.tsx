"use client";

import Link from "next/link";
import { memo } from "react";
import { LiveBadge } from "@/components/markets/LiveBadge";
import { MarketThumbnail } from "@/components/market/MarketThumbnail";
import { PriceDisplay } from "@/components/market/PriceDisplay";
import { YesNoChip } from "@/components/market/YesNoChip";
import type { CryptoUpDownCardProps } from "@/lib/cards/cryptoCardTypes";
import { formatVolume } from "@/lib/format/volume";
import { cn } from "@/lib/cn";

const cardShellClasses = cn(
  "group relative flex min-h-[180px] flex-col rounded-card border border-neutral-100 bg-card px-3 pb-3 pt-3",
  "transition-colors duration-200 hover:border-neutral-200 hover:bg-surface-2",
  "focus-within:ring-2 focus-within:ring-ring focus-within:outline-none",
);

/**
 * Crypto up/down market card with Live badge and asset label.
 */
export const CryptoUpDownCard = memo(function CryptoUpDownCard({
  slug,
  title,
  image,
  volume,
  marketId,
  yesOutcomeId,
  yesPrice,
  noPrice,
  assetLabel,
  isLive,
}: CryptoUpDownCardProps) {
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

        <div className="mt-2 flex items-center justify-center gap-4">
          <div className="text-center">
            <PriceDisplay
              marketId={marketId}
              outcomeId={yesOutcomeId}
              initialPrice={yesPrice}
              className="text-base leading-5 font-semibold text-yes"
            />
            <span className="text-xs font-semibold text-neutral-500">Up</span>
          </div>
          <div className="text-center">
            <PriceDisplay
              marketId={marketId}
              outcomeId={yesOutcomeId}
              initialPrice={noPrice}
              className="text-base leading-5 font-semibold text-no"
            />
            <span className="text-xs font-semibold text-neutral-500">Down</span>
          </div>
        </div>

        <div className="mt-3 flex gap-2 pointer-events-auto">
          <YesNoChip
            side="yes"
            price={yesPrice}
            marketId={marketId}
            outcomeId={yesOutcomeId}
            fullWidth
          />
          <YesNoChip
            side="no"
            price={noPrice}
            marketId={marketId}
            outcomeId={yesOutcomeId}
            fullWidth
          />
        </div>

        <p className="mt-auto pt-3 text-[13px] leading-4 font-w490 text-neutral-300">
          {formatVolume(volume)}
        </p>
      </div>
    </article>
  );
});
