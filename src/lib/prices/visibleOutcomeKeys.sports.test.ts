import { describe, expect, it } from 'vitest';
import type { SportsGame } from '@/types/polymarket';
import { getVisibleOutcomeSeedsFromSportsGames } from '@/lib/prices/visibleOutcomeKeys';

describe('getVisibleOutcomeSeedsFromSportsGames', () => {
  it('collects token ids from moneyline, spread, and total markets', () => {
    const game: SportsGame = {
      gameId: 'g1',
      eventId: 'e1',
      slug: 'test-game',
      title: 'Team A vs Team B',
      league: 'MLB',
      leagueId: 'mlb',
      volume: 1000,
      matchupKey: 'team a vs team b',
      teams: [
        {
          id: 1,
          name: 'Team A',
          abbreviation: 'TA',
        },
        {
          id: 2,
          name: 'Team B',
          abbreviation: 'TB',
        },
      ],
      tags: ['mlb'],
      moneyline: {
        id: 'm1',
        question: 'Winner',
        volume: 100,
        sportsMarketType: 'moneyline',
        outcomes: [
          { id: 'tok-1', name: 'Team A', price: 0.4 },
          { id: 'tok-2', name: 'Team B', price: 0.6 },
        ],
      },
      spread: {
        id: 'm2',
        question: 'Spread',
        volume: 50,
        sportsMarketType: 'spread',
        line: -1.5,
        outcomes: [
          { id: 'tok-3', name: 'Team A', price: 0.5 },
          { id: 'tok-4', name: 'Team B', price: 0.5 },
        ],
      },
      total: {
        id: 'm3',
        question: 'Total',
        volume: 50,
        sportsMarketType: 'total',
        line: 7.5,
        outcomes: [
          { id: 'tok-5', name: 'Over', price: 0.5 },
          { id: 'tok-6', name: 'Under', price: 0.5 },
        ],
      },
    };

    const seeds = getVisibleOutcomeSeedsFromSportsGames([game]);
    const assetIds = seeds.map((seed) => seed.assetId).sort();

    expect(assetIds).toEqual([
      'tok-1',
      'tok-2',
      'tok-3',
      'tok-4',
      'tok-5',
      'tok-6',
    ]);
  });
});
