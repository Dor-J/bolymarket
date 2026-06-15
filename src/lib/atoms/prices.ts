import { atom } from "jotai";
import type { Store } from "jotai/vanilla/store";
import { atomFamily } from "jotai/utils";
import type { MarketPriceState } from "@/types/polymarket";

const PRICE_EPSILON = 1e-6;

/**
 * Per-outcome live price state keyed by `${marketId}:${outcomeId}`.
 */
export const outcomePriceAtomFamily = atomFamily((outcomeKey: string) => {
  void outcomeKey;
  return atom<MarketPriceState | null>(null);
});

/**
 * @deprecated Use `outcomePriceAtomFamily` — kept for backward compatibility during migration.
 */
export const marketPriceAtomFamily = outcomePriceAtomFamily;

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
