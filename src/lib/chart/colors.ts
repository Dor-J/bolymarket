/** Shared palette for chart lines and outcome legend dots. */
export const OUTCOME_COLORS = [
  "#1452f0",
  "#30a159",
  "#e23939",
  "#f8d743",
  "#bd8de7",
  "#06b3d6",
] as const;

/**
 * Returns a stable color for an outcome index.
 */
export function getOutcomeColor(index: number): string {
  return OUTCOME_COLORS[index % OUTCOME_COLORS.length] ?? OUTCOME_COLORS[0];
}
