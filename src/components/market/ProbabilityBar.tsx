"use client";

import { useAtomValue } from "jotai";
import { outcomePriceAtomFamily } from "@/lib/atoms/prices";
import { getOutcomePriceKey } from "@/lib/prices/outcomeKey";
import type { MarketPriceState } from "@/types/polymarket";
import { cn } from "@/lib/cn";

export interface ProbabilityBarProps {
  marketId: string;
  yesOutcomeId: string;
  yesPrice: number;
  className?: string;
  livePrice?: MarketPriceState | null;
}

function ProbabilityBarValue({
  yesPrice,
  className,
  livePrice,
}: Pick<ProbabilityBarProps, "yesPrice" | "className"> & {
  livePrice: MarketPriceState | null;
}) {
  const price = livePrice?.value ?? yesPrice;
  const yesPercent = Math.min(100, Math.max(0, price * 100));
  const noPercent = 100 - yesPercent;

  return (
    <div
      className={cn(
        "flex h-2 w-full overflow-hidden rounded-full bg-surface-2",
        className,
      )}
      role="presentation"
      aria-hidden
    >
      <div
        className="h-full bg-yes transition-[width] duration-300 ease-out"
        style={{ width: `${yesPercent}%` }}
      />
      <div
        className="h-full bg-no transition-[width] duration-300 ease-out"
        style={{ width: `${noPercent}%` }}
      />
    </div>
  );
}

function SubscribedProbabilityBar({
  marketId,
  yesOutcomeId,
  yesPrice,
  className,
}: ProbabilityBarProps) {
  const outcomeKey = getOutcomePriceKey(marketId, yesOutcomeId);
  const livePrice = useAtomValue(outcomePriceAtomFamily(outcomeKey));

  return (
    <ProbabilityBarValue
      yesPrice={yesPrice}
      className={className}
      livePrice={livePrice}
    />
  );
}

/**
 * Horizontal probability bar driven by the live Yes outcome price (§12.3).
 */
export function ProbabilityBar(props: ProbabilityBarProps) {
  if (props.livePrice !== undefined) {
    return (
      <ProbabilityBarValue
        yesPrice={props.yesPrice}
        className={props.className}
        livePrice={props.livePrice}
      />
    );
  }

  return <SubscribedProbabilityBar {...props} />;
}
