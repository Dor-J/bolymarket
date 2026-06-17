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
  "group/card relative isolate flex min-h-[180px] h-full flex-col justify-between overflow-hidden rounded-xl border border-neutral-100 bg-card pt-3",
  "shadow-md shadow-black/4 transition hover:-translate-y-px hover:shadow-md hover:shadow-black/8",
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
      <Link href={href} className="absolute inset-0 z-0 rounded-xl" aria-label={title} />

      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between">
        <div className="flex w-full items-start gap-2 px-3">
          <MarketThumbnail
            title={title}
            image={image}
            size={38}
            className="rounded-sm"
          />
          <div className="flex min-w-0 flex-1 justify-between gap-3">
            <h3 className="line-clamp-3 min-w-0 text-sm leading-5 font-w590 text-text decoration-2 group-hover/card:underline">
              {title}
            </h3>
            <div className="relative -mt-1 flex w-[58px] shrink-0 flex-col items-center">
              <svg
                aria-hidden
                viewBox="-29 -29 58 34"
                className="h-[34px] w-[58px] overflow-visible"
              >
                <path
                  d="M 3.53 -28.78 A 29 29 0 0 1 28.56 5.04"
                  fill="none"
                  stroke="var(--neutral-100)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <path
                  d="M -28.56 5.04 A 29 29 0 0 1 -2.53 -28.89"
                  fill="none"
                  stroke="var(--yes)"
                  strokeOpacity="0.55"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="-mt-7 flex flex-col items-center">
                <PriceDisplay
                  marketId={marketId}
                  outcomeId={yesOutcomeId}
                  initialPrice={yesPrice}
                  className="text-base leading-5 font-medium text-neutral-950"
                />
                <span className="text-xs leading-4 font-semibold text-neutral-500">Up</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end gap-1.5 px-3 pb-2">
          <div className="pointer-events-auto flex h-[62px] items-end justify-between gap-2">
            <YesNoChip
              side="yes"
              price={yesPrice}
              marketId={marketId}
              outcomeId={yesOutcomeId}
              fullWidth
              label="Up"
              className="h-10 rounded-sm"
            />
            <YesNoChip
              side="no"
              price={noPrice}
              marketId={marketId}
              outcomeId={yesOutcomeId}
              fullWidth
              label="Down"
              className="h-10 rounded-sm"
            />
          </div>

          <div className="flex items-center justify-between text-[13px] leading-4 font-w490 text-neutral-500">
            <div className="flex items-center gap-1">
              {isLive ? <LiveBadge /> : null}
              {isLive && assetLabel ? <span className="opacity-50">·</span> : null}
              {assetLabel ? <span>{assetLabel}</span> : null}
              {!isLive && !assetLabel ? <span>{formatVolume(volume)}</span> : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
});
