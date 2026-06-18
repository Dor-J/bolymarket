/** Shared palette for chart lines and outcome legend dots. */
export const OUTCOME_COLORS = [
  '#87BFFF',
  '#4378FF',
  '#FDC503',
  '#FF7F0E',
  '#B07AA1',
  '#59A14F',
] as const;

/**
 * Returns a stable color for an outcome index.
 */
export function getOutcomeColor(index: number): string {
  return OUTCOME_COLORS[index % OUTCOME_COLORS.length] ?? OUTCOME_COLORS[0];
}
