import type { Store } from "jotai/vanilla/store";
import type { OutcomePriceSeed } from "@/lib/prices/visibleOutcomeKeys";
import { seedOutcomePrice } from "./prices";

/**
 * Seeds multiple outcome price atoms from API snapshot values.
 */
export function seedOutcomePrices(
  store: Store,
  seeds: OutcomePriceSeed[],
  options?: { force?: boolean },
): void {
  for (const seed of seeds) {
    seedOutcomePrice(store, seed.outcomeKey, seed.price, options?.force);
  }
}
