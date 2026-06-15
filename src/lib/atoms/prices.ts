import { atom, type PrimitiveAtom } from "jotai";
import type { Store } from "jotai/vanilla/store";
import { atomFamily } from "jotai-family";
import type { MarketPriceState } from "@/types/polymarket";

const PRICE_EPSILON = 1e-6;

/**
 * Per-outcome live price state keyed by `${marketId}:${outcomeId}`.
 */
export const outcomePriceAtomFamily = atomFamily<
  string,
  PrimitiveAtom<MarketPriceState | null>
>(() => atom<MarketPriceState | null>(null));

/**
 * Removes cached outcome atoms that are no longer in the active visible set.
 */
export function pruneStaleOutcomePrices(activeKeys: ReadonlySet<string>): void {
  for (const key of outcomePriceAtomFamily.getParams()) {
    if (!activeKeys.has(key)) {
      outcomePriceAtomFamily.remove(key);
    }
  }
}

/**
 * Seeds an outcome atom from an API snapshot. Idempotent unless `force` is true.
 */
export function seedOutcomePrice(
  store: Store,
  outcomeKey: string,
  price: number,
  force = false,
): void {
  const atom = outcomePriceAtomFamily(outcomeKey);
  const current = store.get(atom);

  if (current !== null && !force) {
    return;
  }

  store.set(atom, {
    value: price,
    previousValue: price,
    updatedAt: Date.now(),
  });
}

/**
 * Commits a simulated or live tick to an outcome atom.
 */
export function commitOutcomePriceTick(
  store: Store,
  outcomeKey: string,
  nextValue: number,
): void {
  const atom = outcomePriceAtomFamily(outcomeKey);
  const current = store.get(atom);
  const previousValue = current?.value ?? nextValue;

  if (Math.abs(previousValue - nextValue) < PRICE_EPSILON) {
    return;
  }

  store.set(atom, {
    value: nextValue,
    previousValue,
    updatedAt: Date.now(),
  });
}
