import { describe, expect, it } from 'vitest';
import type { SportsEvent, SportsMarket, TeamInfo } from '@/types/polymarket';
import {
  buildSportsGameCard,
  buildSportsGamesFromEvents,
  isLiveOrUpcomingGame,
} from './buildSportsGameCard';

function createSportsMarket(
  overrides: Partial<SportsMarket> & Pick<SportsMarket, 'id' | 'question'>,
): SportsMarket {
  return {
    volume: 1000,
    outcomes: [
      { id: 'tok-a', name: 'Atlanta Braves', price: 0.42 },
      { id: 'tok-b', name: 'Chicago Cubs', price: 0.58 },
    ],
    sportsMarketType: 'moneyline',
    gameId: 'game-1',
    gameStartTime: new Date(Date.now() + 60 * 60_000).toISOString(),
    teamAId: '1',
    teamBId: '2',
    shortOutcomes: ['ATL', 'CHC'],
    ...overrides,
  };
}

function createEvent(overrides: Partial<SportsEvent> = {}): SportsEvent {
  const moneyline = createSportsMarket({
    id: 'm1',
    question: 'Braves vs Cubs',
    sportsMarketType: 'moneyline',
  });
  const spread = createSportsMarket({
    id: 'm2',
    question: 'Spread',
    sportsMarketType: 'spread',
    line: -1.5,
  });
  const total = createSportsMarket({
    id: 'm3',
    question: 'Total',
    sportsMarketType: 'total',
    line: 7.5,
    outcomes: [
      { id: 'tok-over', name: 'Over', price: 0.52 },
      { id: 'tok-under', name: 'Under', price: 0.48 },
    ],
  });

  return {
    id: 'event-1',
    slug: 'braves-cubs-2026',
    title: 'Braves vs. Cubs',
    tags: ['mlb', 'sports'],
    volume: 5000,
    markets: [moneyline, spread, total],
    sportsMarkets: [moneyline, spread, total],
    ...overrides,
  };
}

const teamLookup = new Map<string, TeamInfo>([
  [
    '1',
    {
      id: 1,
      name: 'Atlanta Braves',
      abbreviation: 'ATL',
      record: '40-30',
      logo: 'https://example.com/atl.png',
      league: 'mlb',
      color: '#C00040',
    },
  ],
  [
    '2',
    {
      id: 2,
      name: 'Chicago Cubs',
      abbreviation: 'CHC',
      record: '38-36',
      logo: 'https://example.com/chc.png',
      league: 'mlb',
      color: '#004A94',
    },
  ],
]);

describe('buildSportsGameCard', () => {
  it('groups multi-market events into a single game card', () => {
    const game = buildSportsGameCard(createEvent(), teamLookup);

    expect(game).not.toBeNull();
    expect(game?.gameId).toBe('game-1');
    expect(game?.moneyline?.id).toBe('m1');
    expect(game?.spread?.id).toBe('m2');
    expect(game?.total?.id).toBe('m3');
    expect(game?.teams[0]?.abbreviation).toBe('ATL');
    expect(game?.teams[1]?.abbreviation).toBe('CHC');
    expect(game?.teams[0]?.record).toBe('40-30');
  });
});

describe('isLiveOrUpcomingGame', () => {
  it('excludes futures and prop markets', () => {
    const game = buildSportsGameCard(
      createEvent({ title: 'MLB World Series Champion 2026' }),
      teamLookup,
    );
    expect(game).not.toBeNull();
    if (game) {
      expect(isLiveOrUpcomingGame(game)).toBe(false);
    }

    const propGame = buildSportsGameCard(
      createEvent({ title: 'Portugal vs. DR Congo - Exact Score' }),
      teamLookup,
    );
    expect(propGame).not.toBeNull();
    if (propGame) {
      expect(isLiveOrUpcomingGame(propGame)).toBe(false);
    }
  });
});

describe('buildSportsGamesFromEvents', () => {
  it('returns sorted live/upcoming games', () => {
    const lowVolume = createEvent({
      id: 'e-low',
      slug: 'low-volume',
      title: 'Braves vs. Cubs',
      volume: 100,
    });
    const highVolume = createEvent({
      id: 'e-high',
      slug: 'high-volume',
      title: 'Yankees vs. Red Sox',
      volume: 9000,
    });

    const games = buildSportsGamesFromEvents(
      [lowVolume, highVolume],
      teamLookup,
    );

    expect(games.length).toBe(2);
    expect(games[0]?.volume).toBe(9000);
  });
});
