import type {
  ClassifiedSportsMarkets,
  SportsMarket,
  SportsMarketType,
} from '@/types/polymarket';

const TYPE_PRIORITY: SportsMarketType[] = [
  'moneyline',
  'spread',
  'total',
  'prop',
  'unknown',
];

/**
 * Classifies sports markets into moneyline, spread, and total buckets.
 */
export function classifySportsMarkets(
  markets: SportsMarket[],
): ClassifiedSportsMarkets {
  const result: ClassifiedSportsMarkets = {};

  const moneylineCandidates = markets.filter(
    (market) => market.sportsMarketType === 'moneyline',
  );
  if (moneylineCandidates.length > 0) {
    result.moneyline = moneylineCandidates[0];
  }

  for (const market of markets) {
    const type = market.sportsMarketType;
    if (type === 'spread' && !result.spread) {
      result.spread = market;
    } else if (type === 'total' && !result.total) {
      result.total = market;
    }
  }

  if (!result.moneyline) {
    const fallback = markets.find(
      (market) =>
        market.sportsMarketType === 'moneyline' ||
        (market.sportsMarketType === 'unknown' &&
          market.outcomes.length === 2 &&
          !/\b(o\/u|over|under|spread|handicap)\b/i.test(market.question)),
    );
    if (fallback) {
      result.moneyline = fallback;
    }
  }

  return result;
}

/**
 * Picks the primary market type from a classified set.
 */
export function getPrimarySportsMarket(
  classified: ClassifiedSportsMarkets,
): SportsMarket | undefined {
  for (const type of TYPE_PRIORITY) {
    if (type === 'moneyline' && classified.moneyline) {
      return classified.moneyline;
    }
    if (type === 'spread' && classified.spread) {
      return classified.spread;
    }
    if (type === 'total' && classified.total) {
      return classified.total;
    }
  }

  return undefined;
}
