import type { Store } from "jotai/vanilla/store";
import type { OutcomePriceSeed } from "@/lib/prices/visibleOutcomeKeys";

/** Configuration for the client-side price simulation engine. */
export interface SimulationConfig {
  /** Base interval between tick batches in milliseconds. */
  intervalMs: number;
  /** Maximum absolute random-walk step per tick. */
  maxStep: number;
}

/** Contract for a live price update source. */
export interface PriceSource {
  start(
    outcomeKeys: string[],
    store: Store,
    seeds?: OutcomePriceSeed[],
  ): void;
  stop(): void;
}
