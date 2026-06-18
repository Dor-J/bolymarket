import { describe, expect, it } from 'vitest';
import { sportsGameStateAtomFamily } from '@/lib/atoms/sportsGameState';
import { createJotaiStore, renderHookWithProviders } from '@/test/test-utils';
import type { SportsGame, SportsGameState } from '@/types/polymarket';
import { useSportsGameState } from './useSportsGameState';

function createSportsGame(overrides: Partial<SportsGame> = {}): SportsGame {
  return {
    gameId: 'game-1',
    eventId: 'event-1',
    slug: 'home-away',
    title: 'Home vs Away',
    league: 'MLB',
    leagueId: 'mlb',
    volume: 1_000,
    matchupKey: 'home-vs-away',
    teams: [
      { id: 1, name: 'Home', abbreviation: 'HOM' },
      { id: 2, name: 'Away', abbreviation: 'AWY' },
    ],
    tags: ['sports'],
    ...overrides,
  };
}

function createGameState(overrides: Partial<SportsGameState>): SportsGameState {
  return {
    gameId: 'game-1',
    status: 'In Progress',
    live: true,
    ...overrides,
  };
}

describe('useSportsGameState', () => {
  it('returns game state by game id first', () => {
    const jotaiStore = createJotaiStore();
    const byId = createGameState({ gameId: 'game-1', score: '1-0' });
    const bySlug = createGameState({ gameId: 'game-1', score: '2-0' });

    jotaiStore.set(sportsGameStateAtomFamily('game-1'), byId);
    jotaiStore.set(sportsGameStateAtomFamily('home-away'), bySlug);

    const { result } = renderHookWithProviders(
      () => useSportsGameState(createSportsGame()),
      { jotaiStore },
    );

    expect(result.current).toBe(byId);
  });

  it('falls back to slug and matchup keys', () => {
    const jotaiStore = createJotaiStore();
    const bySlug = createGameState({ gameId: 'game-1', score: '2-1' });
    const byMatchup = createGameState({ gameId: 'game-1', score: '3-1' });

    jotaiStore.set(sportsGameStateAtomFamily('home-away'), bySlug);
    jotaiStore.set(sportsGameStateAtomFamily('home-vs-away'), byMatchup);

    const { result: slugResult } = renderHookWithProviders(
      () => useSportsGameState(createSportsGame()),
      { jotaiStore },
    );

    expect(slugResult.current).toBe(bySlug);

    jotaiStore.set(sportsGameStateAtomFamily('home-away'), null);

    const { result: matchupResult } = renderHookWithProviders(
      () => useSportsGameState(createSportsGame()),
      { jotaiStore },
    );

    expect(matchupResult.current).toBe(byMatchup);
  });

  it('returns null when no keyed state exists', () => {
    const { result } = renderHookWithProviders(() =>
      useSportsGameState(createSportsGame()),
    );

    expect(result.current).toBeNull();
  });
});
