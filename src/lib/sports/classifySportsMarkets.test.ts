import { describe, expect, it } from 'vitest';
import type { SportsMarket } from '@/types/polymarket';
import { parseSportsMarketType } from '@/lib/api/normalize';
import { classifySportsMarkets } from './classifySportsMarkets';

function createMarket(
  overrides: Partial<SportsMarket> & Pick<SportsMarket, 'id' | 'question'>,
): SportsMarket {
  return {
    volume: 0,
    outcomes: [
      { id: 'a', name: 'Team A', price: 0.5 },
      { id: 'b', name: 'Team B', price: 0.5 },
    ],
    sportsMarketType: 'unknown',
    ...overrides,
  };
}

describe('parseSportsMarketType', () => {
  it('maps Gamma sportsMarketType values', () => {
    expect(parseSportsMarketType('moneyline')).toBe('moneyline');
    expect(parseSportsMarketType('child_moneyline')).toBe('moneyline');
    expect(parseSportsMarketType('spreads')).toBe('spread');
    expect(parseSportsMarketType('totals')).toBe('total');
    expect(parseSportsMarketType('map_handicap')).toBe('spread');
  });

  it('falls back to question patterns', () => {
    expect(parseSportsMarketType(undefined, 'Spread: Team A (-3.5)')).toBe('spread');
    expect(parseSportsMarketType(undefined, 'Total Points O/U 45.5')).toBe('total');
    expect(parseSportsMarketType(undefined, 'Who will win?')).toBe('moneyline');
  });
});

describe('classifySportsMarkets', () => {
  it('classifies moneyline, spread, and total markets', () => {
    const markets = [
      createMarket({
        id: '1',
        question: 'Moneyline',
        sportsMarketType: 'moneyline',
        gameId: '100',
      }),
      createMarket({
        id: '2',
        question: 'Spread',
        sportsMarketType: 'spread',
        line: -3.5,
        gameId: '100',
      }),
      createMarket({
        id: '3',
        question: 'Total',
        sportsMarketType: 'total',
        line: 7.5,
        gameId: '100',
      }),
    ];

    const classified = classifySportsMarkets(markets);
    expect(classified.moneyline?.id).toBe('1');
    expect(classified.spread?.id).toBe('2');
    expect(classified.total?.id).toBe('3');
  });

  it('prefers primary moneyline over child markets', () => {
    const markets = [
      createMarket({
        id: 'child',
        question: 'Game 1 Winner',
        sportsMarketType: 'moneyline',
      }),
      createMarket({
        id: 'main',
        question: 'Match Winner',
        sportsMarketType: 'moneyline',
      }),
    ];

    const classified = classifySportsMarkets(markets);
    expect(classified.moneyline?.id).toBe('child');
  });
});
