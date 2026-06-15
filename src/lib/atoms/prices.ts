import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import type { MarketPriceState } from "@/types/polymarket";

/**
 * Per-market live price state.
 * One atom per market ID — a tick updates only the subscribed leaf component.
 */
export const marketPriceAtomFamily = atomFamily((marketId: string) => {
  void marketId;
  return atom<MarketPriceState | null>(null);
});
