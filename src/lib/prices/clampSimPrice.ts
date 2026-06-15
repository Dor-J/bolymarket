const SIM_MIN = 0.01;
const SIM_MAX = 0.99;

/**
 * Clamps a simulated probability to the assignment-friendly 0.01–0.99 range.
 */
export function clampSimPrice(price: number): number {
  if (!Number.isFinite(price)) {
    return SIM_MIN;
  }

  return Math.min(SIM_MAX, Math.max(SIM_MIN, price));
}
