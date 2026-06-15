import { useMemo } from "react";

export type PriceDirection = "up" | "down" | "none";

export interface UsePriceFlashResult {
  direction: PriceDirection;
  flashClassName: string;
}

/**
 * Returns flash styling when a price changes direction.
 * Implementation deferred to Phase 4 — currently returns a neutral state.
 */
export function usePriceFlash(
  current: number,
  previous: number,
): UsePriceFlashResult {
  void current;
  void previous;

  return useMemo(
    () => ({
      direction: "none",
      flashClassName: "",
    }),
    [],
  );
}
