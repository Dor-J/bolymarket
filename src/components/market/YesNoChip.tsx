"use client";

import { Chip, type ChipVariant } from "@/components/ui/Chip";
import type { MarketPriceState } from "@/types/polymarket";
import { PriceDisplay } from "./PriceDisplay";

export interface YesNoChipProps {
  side: ChipVariant;
  price: number;
  marketId: string;
  outcomeId: string;
  fullWidth?: boolean;
  label?: string;
  className?: string;
  onClick?: () => void;
  livePrice?: MarketPriceState | null;
}

/**
 * Yes/No trading chip with live price display on the Yes outcome atom.
 */
export function YesNoChip({
  side,
  price,
  marketId,
  outcomeId,
  fullWidth = false,
  label: customLabel,
  className,
  onClick,
  livePrice,
}: YesNoChipProps) {
  const label = customLabel ?? (side === "yes" ? "Yes" : "No");

  return (
    <Chip
      variant={side}
      fullWidth={fullWidth}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick?.();
      }}
    >
      <span className="absolute top-1/2 left-1/2 max-w-[36px] -translate-x-1/2 -translate-y-1/2 truncate transition-opacity group-hover:opacity-0">
        {label}
      </span>
      <PriceDisplay
        marketId={marketId}
        outcomeId={outcomeId}
        initialPrice={price}
        side={side}
        livePrice={livePrice}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
      />
    </Chip>
  );
}
