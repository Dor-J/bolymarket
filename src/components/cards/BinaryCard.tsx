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

/**
 * Binary Yes/No market card with centered chance display.
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
          <h3 className="line-clamp-3 min-w-0 flex-1 text-sm leading-5 font-w590 text-text decoration-2 group-hover/card:underline">
            {title}
          </h3>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-0.5 px-3">
          <PriceDisplay
            marketId={marketId}
            outcomeId={yesOutcomeId}
            initialPrice={yesPrice}
            className="text-base leading-5 font-medium text-neutral-950"
          />
          <span className="text-xs leading-4 font-semibold text-neutral-500">
            chance
          </span>
        </div>

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
