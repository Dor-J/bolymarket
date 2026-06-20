"use client";

import { memo } from "react";
import { MarketThumbnail } from "@/components/market/MarketThumbnail";
import { PriceDisplay } from "@/components/market/PriceDisplay";
import { formatDetailVolume } from "@/lib/format/detailVolume";
import { cn } from "@/lib/cn";

export interface OutcomeRowProps {
  marketId: string;
  outcomeId: string;
  name: string;
  volume: number;
  yesPrice: number;
  noPrice: number;
  image?: string;
}

function RewardsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 18 18"
      aria-hidden
    >
      <line
        x1="9"
        y1="5.25"
        x2="9"
        y2="16.25"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M3.75 3.5c0-.966.784-1.75 1.75-1.75 2.589 0 3.5 3.5 3.5 3.5H5.5c-.966 0-1.75-.784-1.75-1.75Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M12.5 5.25H9s.911-3.5 3.5-3.5c.966 0 1.75.784 1.75 1.75s-.784 1.75-1.75 1.75Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M14.25 8.25v6c0 1.105-.895 2-2 2h-6.5c-1.105 0-2-.895-2-2v-6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <rect
        x="1.75"
        y="5.25"
        width="14.5"
        height="3"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/**
 * Single outcome row with Polymarket-style horizontal trading controls.
 */
export const OutcomeRow = memo(function OutcomeRow({
  marketId,
  outcomeId,
  name,
  volume,
  yesPrice,
  noPrice: _noPrice,
  image,
}: OutcomeRowProps) {
  return (
    <article className="[&+&]:border-t [&+&]:border-border">
      <div className="group relative flex w-full cursor-pointer flex-col gap-3 overflow-visible py-3 transition">
        <div className="absolute -top-px -right-3 -bottom-px -left-3 rounded-md transition-colors group-hover:bg-surface-2/50" />

        <div className="relative z-1 flex min-h-12 w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <MarketThumbnail
              title={name}
              image={image}
              size={40}
              className="rounded-sm"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-y-1">
              <h3 className="max-w-[400px] truncate text-heading-lg font-semibold text-text">
                {name}
              </h3>
              <div className="flex min-h-5 items-center gap-1.5">
                <p className="text-body-sm leading-none whitespace-nowrap text-text-secondary">
                  {formatDetailVolume(volume)}
                </p>
                <button
                  type="button"
                  aria-label="Rewards"
                  className={cn(
                    "inline-flex size-5 items-center justify-center rounded-sm",
                    "bg-button-ghost-bg text-text-secondary hover:bg-surface-2",
                    "focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
                  )}
                >
                  <RewardsIcon />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-start md:justify-center">
            <PriceDisplay
              marketId={marketId}
              outcomeId={outcomeId}
              initialPrice={yesPrice}
              className="text-[28px] leading-7 font-semibold text-text-primary"
            />
          </div>

          <div className="pointer-events-auto flex flex-col gap-2 sm:flex-row md:justify-end">
            <button
              type="button"
              className={cn(
                "inline-flex h-12 min-w-[136px] cursor-pointer items-center justify-center",
                "gap-1 rounded-sm bg-green-600 px-4 py-2 text-body-base font-semibold",
                "text-white transition duration-150 active:scale-100",
                "focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
              )}
            >
              <span className="min-w-0 truncate opacity-80">Buy Yes</span>
              <PriceDisplay
                marketId={marketId}
                outcomeId={outcomeId}
                initialPrice={yesPrice}
                format="cents"
                side="yes"
                className="shrink-0 text-base"
                enableFlash={false}
              />
            </button>
            <button
              type="button"
              className={cn(
                "inline-flex h-12 min-w-[136px] cursor-pointer items-center justify-center",
                "gap-1 rounded-sm bg-red-500/9 px-4 py-2 text-body-base font-semibold",
                "text-red-500 transition duration-150 active:scale-100 hover:bg-red-500/13",
                "focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
              )}
            >
              <span className="min-w-0 truncate opacity-80">Buy No</span>
              <PriceDisplay
                marketId={marketId}
                outcomeId={outcomeId}
                initialPrice={yesPrice}
                format="cents"
                side="no"
                className="shrink-0 text-base"
                enableFlash={false}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});
