"use client";

import Link from "next/link";
import { memo } from "react";
import { MarketThumbnail } from "@/components/market/MarketThumbnail";
import { PriceDisplay } from "@/components/market/PriceDisplay";
import { ProbabilityBar } from "@/components/market/ProbabilityBar";
import { YesNoChip } from "@/components/market/YesNoChip";
import type { BinaryCardProps } from "@/lib/cards/types";
import { formatVolume } from "@/lib/format/volume";
import { cn } from "@/lib/cn";

const cardShellClasses = cn(
  "group/card relative isolate flex min-h-[180px] h-full flex-col justify-between overflow-hidden rounded-xl border border-neutral-100 bg-card pt-3",
  "shadow-md shadow-black/4 transition hover:-translate-y-px hover:shadow-md hover:shadow-black/8",
  "focus-within:ring-2 focus-within:ring-ring focus-within:outline-none",
);

function ChanceMeter({
  marketId,
  outcomeId,
  initialPrice,
}: {
  marketId: string;
  outcomeId: string;
  initialPrice: number;
}) {
  const progress = Math.min(1, Math.max(0, initialPrice));

  return (
    <div className="flex w-[58px] shrink-0 flex-col items-end">
      <svg
        width="58"
        height="34"
        viewBox="0 0 58 34"
        className="max-w-[58px] overflow-visible"
        aria-hidden
      >
        <path
          d="M5 28.5A29 29 0 0 1 53 28.5"
          fill="none"
          stroke="var(--neutral-100)"
          strokeLinecap="round"
          strokeWidth="4.5"
        />
        <path
          d="M5 28.5A29 29 0 0 1 53 28.5"
          fill="none"
          pathLength={1}
          stroke="var(--color-red-500)"
          strokeDasharray={`${progress} 1`}
          strokeLinecap="round"
          strokeOpacity={0.84}
          strokeWidth="4.5"
        />
      </svg>
      <div className="mt-[-28px] flex w-full flex-col items-center">
        <PriceDisplay
          marketId={marketId}
          outcomeId={outcomeId}
          initialPrice={initialPrice}
          className="text-center text-heading-lg font-medium text-neutral-950"
        />
        <p className="line-clamp-2 text-center text-body-xs font-semibold text-text-secondary">
          chance
        </p>
      </div>
    </div>
  );
}

/**
 * Binary Yes/No market card with top-right chance display.
 */
export const BinaryCard = memo(function BinaryCard({
  slug,
  title,
  image,
  volume,
  marketId,
  yesOutcomeId,
  yesPrice,
  noPrice,
}: BinaryCardProps) {
  const href = `/event/${slug}`;

  return (
    <article className={cardShellClasses}>
      <Link href={href} className="absolute inset-0 z-0 rounded-xl" aria-label={title} />

      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between">
        <div className="flex h-[42px] w-full items-start gap-2 px-3">
          <MarketThumbnail
            title={title}
            image={image}
            size={38}
            className="rounded-sm"
          />
          <div className="flex min-w-0 flex-1 gap-4">
            <h3 className="line-clamp-3 min-w-0 flex-1 text-sm leading-5 font-w590 text-text decoration-2 group-hover/card:underline">
              {title}
            </h3>
            <ChanceMeter
              marketId={marketId}
              outcomeId={yesOutcomeId}
              initialPrice={yesPrice}
            />
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex flex-col justify-end gap-1.5 px-3 pb-2">
          <ProbabilityBar
            marketId={marketId}
            yesOutcomeId={yesOutcomeId}
            yesPrice={yesPrice}
          />

          <div className="pointer-events-auto flex gap-2">
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

          <p className="text-[13px] leading-4 font-w490 text-neutral-500">
            {formatVolume(volume)}
          </p>
        </div>
      </div>
    </article>
  );
});
