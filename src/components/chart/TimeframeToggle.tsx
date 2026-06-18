"use client";

import { cn } from "@/lib/cn";
import type { Timeframe } from "@/lib/chart/types";

const TIMEFRAMES: Array<{ key: Timeframe; label: string }> = [
  { key: "1h", label: "1H" },
  { key: "6h", label: "6H" },
  { key: "1d", label: "1D" },
  { key: "1w", label: "1W" },
  { key: "1m", label: "1M" },
  { key: "all", label: "ALL" },
];

export interface TimeframeToggleProps {
  value: Timeframe;
  onChange: (timeframe: Timeframe) => void;
  className?: string;
}

/**
 * Timeframe selector for the event detail price chart.
 */
export function TimeframeToggle({
  value,
  onChange,
  className,
}: TimeframeToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Select chart window"
      className={cn(
        "relative inline-flex h-9 items-start justify-center overflow-hidden bg-transparent",
        "p-0 font-medium text-zinc-500",
        className,
      )}
    >
      {TIMEFRAMES.map((timeframe) => {
        const isActive = timeframe.key === value;

        return (
          <button
            key={timeframe.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-state={isActive ? "active" : "inactive"}
            onClick={() => onChange(timeframe.key)}
            className={cn(
              "z-1 inline-flex h-full cursor-pointer items-center justify-center rounded-md px-1.5 py-1",
              "text-body-base font-semibold whitespace-nowrap uppercase ring-offset-background",
              "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              "disabled:pointer-events-none disabled:opacity-50",
              isActive
                ? "text-tabs-text-active"
                : "text-tabs-text hover:text-tabs-text-hover",
            )}
          >
            {timeframe.label}
          </button>
        );
      })}
    </div>
  );
}
