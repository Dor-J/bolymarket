"use client";

import Link from "next/link";
import { memo } from "react";
import { useAtomValue } from "jotai";
import { outcomePriceAtomFamily } from "@/lib/atoms/prices";
import { LiveBadge } from "@/components/markets/LiveBadge";
import { MarketThumbnail } from "@/components/market/MarketThumbnail";
import { PriceDisplay } from "@/components/market/PriceDisplay";
import { YesNoChip } from "@/components/market/YesNoChip";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import type { CryptoUpDownCardProps } from "@/lib/cards/cryptoCardTypes";
import { formatVolume } from "@/lib/format/volume";
import { getOutcomePriceKey } from "@/lib/prices/outcomeKey";
import { cn } from "@/lib/cn";

const cardShellClasses = cn(
  "group/card relative isolate flex min-h-[180px] h-full flex-col justify-between overflow-hidden rounded-xl border border-neutral-100 bg-background pt-3",
  "shadow-md shadow-black/4 transition hover:-translate-y-px hover:shadow-md hover:shadow-black/8",
  "focus-within:ring-2 focus-within:ring-ring focus-within:outline-none",
  "[&_a]:relative [&_a]:z-30 [&_button]:relative [&_button]:z-30",
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
  const outcomeKey = getOutcomePriceKey(marketId, yesOutcomeId);
  const livePrice = useAtomValue(outcomePriceAtomFamily(outcomeKey));

  return (
    <article className={cardShellClasses}>
      <Link
        href={href}
        className="absolute inset-0 z-0 rounded-xl"
        aria-label={title}
      />

      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between">
        <div className="static flex h-[42px] w-full items-start gap-2 px-3">
          <MarketThumbnail
            title={title}
            image={image}
            size={38}
            className="rounded-sm object-cover"
          />
          <div className="flex min-w-0 flex-1 cursor-default justify-between gap-4">
            <h3 className="line-clamp-3 min-w-0 text-body-base font-[590] text-text decoration-2 group-hover/card:underline">
              {title}
            </h3>
            <div className="relative flex w-[58px] shrink-0 flex-col items-center">
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
                  livePrice={livePrice}
                  className="text-base leading-5 font-medium text-neutral-950"
                />
                <span className="text-body-xs line-clamp-2 text-center font-semibold text-text-secondary">
                  Up
                </span>
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
              livePrice={livePrice}
              fullWidth
              label="Up"
              className="h-10 rounded-sm"
            />
            <YesNoChip
              side="no"
              price={noPrice}
              marketId={marketId}
              outcomeId={yesOutcomeId}
              livePrice={livePrice}
              fullWidth
              label="Down"
              className="h-10 rounded-sm"
            />
          </div>

          <div className="pointer-events-auto flex items-center justify-between text-body-sm text-text-secondary">
            <div className="flex items-center gap-1 overflow-visible whitespace-nowrap">
              {isLive ? <LiveBadge /> : null}
              {isLive && assetLabel ? (
                <span className="mx-px opacity-50">·</span>
              ) : null}
              {assetLabel ? (
                <Link
                  href={`/crypto/${assetLabel.toLowerCase()}`}
                  className="hover:text-text-tertiary"
                >
                  {assetLabel}
                </Link>
              ) : null}
              {!isLive && !assetLabel ? (
                <span>{formatVolume(volume)}</span>
              ) : null}
            </div>
            <BookmarkButton
              slug={slug}
              className="h-7 w-7 rounded-full text-text-secondary"
            />
          </div>
        </div>
      </div>
    </article>
  );
});
