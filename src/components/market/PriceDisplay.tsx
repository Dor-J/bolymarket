"use client";

import { useAtomValue } from "jotai";
import { outcomePriceAtomFamily } from "@/lib/atoms/prices";
import { formatCents, formatPercent } from "@/lib/format/price";
import { formatSportsCents } from "@/lib/format/sportsPrice";
import { getOutcomePriceKey } from "@/lib/prices/outcomeKey";
import { usePriceFlash } from "@/hooks/usePriceFlash";
import type { MarketPriceState } from "@/types/polymarket";
import { cn } from "@/lib/cn";

export interface PriceDisplayProps {
  marketId: string;
  outcomeId: string;
  initialPrice: number;
  format?: "percent" | "cents" | "sportsCents";
  side?: "yes" | "no";
  className?: string;
  enableFlash?: boolean;
  livePrice?: MarketPriceState | null;
}

function PriceDisplayValue({
  outcomeId,
  initialPrice,
  format,
  side,
  className,
  enableFlash,
  livePrice,
}: Omit<PriceDisplayProps, "marketId"> & {
  format: NonNullable<PriceDisplayProps["format"]>;
  side: NonNullable<PriceDisplayProps["side"]>;
  enableFlash: NonNullable<PriceDisplayProps["enableFlash"]>;
  livePrice: MarketPriceState | null;
}) {
  const yesValue = livePrice?.value ?? initialPrice;
  const yesPrevious = livePrice?.previousValue ?? initialPrice;
  const displayValue = side === "no" ? Math.max(0, 1 - yesValue) : yesValue;
  const displayPrevious =
    side === "no" ? Math.max(0, 1 - yesPrevious) : yesPrevious;
  const formatted =
    format === "sportsCents"
      ? formatSportsCents(displayValue)
      : format === "cents"
      ? formatCents(displayValue)
      : formatPercent(displayValue);

  const { flashClassName } = usePriceFlash(
    displayValue,
    displayPrevious,
    enableFlash ? livePrice?.updatedAt : undefined,
  );

  return (
    <span
      key={enableFlash ? livePrice?.updatedAt : undefined}
      className={cn("price-text tabular-nums", flashClassName, className)}
      data-price={outcomeId}
      aria-live="off"
    >
      {formatted}
    </span>
  );
}

function SubscribedPriceDisplay({
  marketId,
  outcomeId,
  initialPrice,
  format = "percent",
  side = "yes",
  className,
  enableFlash = true,
}: PriceDisplayProps) {
  const outcomeKey = getOutcomePriceKey(marketId, outcomeId);
  const livePrice = useAtomValue(outcomePriceAtomFamily(outcomeKey));

  return (
    <PriceDisplayValue
      outcomeId={outcomeId}
      initialPrice={initialPrice}
      format={format}
      side={side}
      className={className}
      enableFlash={enableFlash}
      livePrice={livePrice}
    />
  );
}

/**
 * Leaf price display — subscribes to per-outcome price atoms unless a parent
 * already read the live price and passed it in.
 */
export function PriceDisplay(props: PriceDisplayProps) {
  if (props.livePrice !== undefined) {
    return (
      <PriceDisplayValue
        outcomeId={props.outcomeId}
        initialPrice={props.initialPrice}
        format={props.format ?? "percent"}
        side={props.side ?? "yes"}
        className={props.className}
        enableFlash={props.enableFlash ?? true}
        livePrice={props.livePrice}
      />
    );
  }

  return <SubscribedPriceDisplay {...props} />;
}
