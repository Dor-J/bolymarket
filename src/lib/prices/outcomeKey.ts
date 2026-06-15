/**
 * Builds a stable atom key for an outcome price subscription.
 */
export function getOutcomePriceKey(
  marketId: string,
  outcomeId: string,
): string {
  return `${marketId}:${outcomeId}`;
}

/**
 * Parses an outcome price key back into market and outcome IDs.
 */
export function parseOutcomePriceKey(outcomeKey: string): {
  marketId: string;
  outcomeId: string;
} {
  const separatorIndex = outcomeKey.indexOf(":");

  if (separatorIndex === -1) {
    return { marketId: outcomeKey, outcomeId: outcomeKey };
  }

  return {
    marketId: outcomeKey.slice(0, separatorIndex),
    outcomeId: outcomeKey.slice(separatorIndex + 1),
  };
}
