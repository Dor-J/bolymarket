import { clampSimPrice } from "./clampSimPrice";

export interface SimulatePriceTickOptions {
  /** Maximum absolute step per tick (probability points). */
  maxStep?: number;
}

/**
 * Applies one random-walk step to a probability value.
 */
export function simulatePriceTick(
  current: number,
  options: SimulatePriceTickOptions = {},
): number {
  const maxStep = options.maxStep ?? 0.015;
  const delta = (Math.random() - 0.5) * 2 * maxStep;

  return clampSimPrice(current + delta);
}
