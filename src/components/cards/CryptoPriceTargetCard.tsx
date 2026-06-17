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
  "group/card relative isolate flex min-h-[180px] h-full flex-col justify-between overflow-hidden rounded-xl border border-neutral-100 bg-background pt-3",
  "shadow-md shadow-black/4 transition hover:-translate-y-px hover:shadow-md hover:shadow-black/8",
  "focus-within:ring-2 focus-within:ring-ring focus-within:outline-none",
  "[&_a]:relative [&_a]:z-30 [&_button]:relative [&_button]:z-30",
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
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-3 text-body-base font-[590] text-text decoration-2 group-hover/card:underline">
              {title}
            </h3>
          </div>
        </div>

        <div className="flex flex-col justify-end gap-1.5 px-3 pb-2">
          <div className="relative mt-0.5 h-20 w-full">
            {outcomes.slice(0, 2).map((outcome) => (
              <div
                key={`${outcome.marketId}-${outcome.outcomeId}`}
                className="flex min-h-10 w-full shrink-0 items-center justify-between gap-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="truncate text-sm leading-5 font-w440 text-neutral-950">
                    {outcome.name}
                  </span>
                </div>
                <div className="pointer-events-auto flex shrink-0 items-center justify-end gap-1">
                  <PriceDisplay
                    marketId={outcome.marketId}
                    outcomeId={outcome.outcomeId}
                    initialPrice={outcome.yesPrice}
                    className="mr-1 text-[15px] leading-[22.5px] font-semibold text-neutral-950"
                  />
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

          <div className="pointer-events-auto flex items-center justify-between text-body-sm text-text-secondary">
            <div className="flex items-center gap-1 overflow-visible whitespace-nowrap">
              {isLive ? <LiveBadge /> : <span>{formatVolume(volume)}</span>}
              {assetLabel ? <span className="mx-px opacity-50">·</span> : null}
              {assetLabel ? (
                <Link
                  href={`/crypto/${assetLabel.toLowerCase()}`}
                  className="hover:text-text-tertiary"
                >
                  {assetLabel}
                </Link>
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
