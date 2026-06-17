import { describe, expect, it } from 'vitest';
import type { SportsGame } from '@/types/polymarket';
import { sortSportsLiveGames } from './sortSportsLiveGames';

function createGame(
  overrides: Partial<SportsGame> & Pick<SportsGame, 'gameId' | 'title'>,
): SportsGame {
  return {
    eventId: overrides.gameId,
    slug: overrides.slug ?? overrides.gameId,
    league: 'MLB',
    leagueId: 'mlb',
    volume: 1000,
    matchupKey: overrides.title.toLowerCase(),
    teams: [
      { id: 1, name: 'A', abbreviation: 'A' },
      { id: 2, name: 'B', abbreviation: 'B' },
    ],
    tags: [],
    ...overrides,
  };
}

describe('sortSportsLiveGames', () => {
  it('prioritizes MLB over World Cup when both are present', () => {
    const games = sortSportsLiveGames([
      createGame({
        gameId: 'wc',
        title: 'Portugal vs. DR Congo',
        leagueId: 'world-cup',
        league: 'WORLD CUP',
        volume: 9000,
      }),
      createGame({
        gameId: 'mlb',
        title: 'Braves vs. Cubs',
        leagueId: 'mlb',
        volume: 100,
      }),
    ]);

    expect(games[0]?.leagueId).toBe('mlb');
  });
});
