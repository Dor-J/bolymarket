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
  "group flex min-h-[180px] flex-col rounded-card border border-[#e6e8ea] bg-card",
  "transition-colors hover:border-[#caced3] hover:bg-surface-2",
  "focus-within:ring-2 focus-within:ring-ring focus-within:outline-none",
);

/**
 * Binary Yes/No market card with centered chance display (§12.2).
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
  return (
    <Link
      href={`/event/${slug}`}
      className={cn(cardShellClasses, "px-3 pb-3 pt-3")}
    >
      <div className="flex items-start gap-2">
        <MarketThumbnail title={title} image={image} />
        <h3 className="line-clamp-2 min-w-0 flex-1 text-sm leading-5 font-semibold text-text">
          {title}
        </h3>
      </div>

      <div className="mt-2 flex flex-col items-center gap-0.5">
        <PriceDisplay
          marketId={marketId}
          outcomeId={yesOutcomeId}
          initialPrice={yesPrice}
          className="text-base leading-5 font-medium text-black"
        />
        <span className="text-xs leading-4 font-semibold text-[#77808d]">
          chance
        </span>
      </div>

      <ProbabilityBar
        marketId={marketId}
        yesOutcomeId={yesOutcomeId}
        yesPrice={yesPrice}
        className="mt-2"
      />

      <div className="mt-3 flex gap-2">
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

      <p className="mt-auto pt-3 text-[13px] leading-4 font-medium text-[#aeb4bc]">
        {formatVolume(volume)}
      </p>
    </Link>
  );
});
