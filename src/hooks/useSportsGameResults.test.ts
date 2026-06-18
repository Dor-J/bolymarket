import { act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { pruneStaleSportsGameStates } from '@/lib/atoms/sportsGameState';
import { resetSportsWebSocketEngineForTests } from '@/lib/realtime/sportsWebSocketEngine';
import { createJotaiStore, renderHookWithProviders } from '@/test/test-utils';
import type { SportsGame } from '@/types/polymarket';
import { useSportsGameResults } from './useSportsGameResults';

const mockRelease = vi.fn();
const mockAcquire = vi.fn(() => ({ release: mockRelease }));

vi.mock('@/lib/atoms/sportsGameState', () => ({
  pruneStaleSportsGameStates: vi.fn(),
}));

vi.mock('@/lib/realtime/sportsWebSocketEngine', () => ({
  acquireSportsWebSocketEngine: (...args: unknown[]) => mockAcquire(...args),
  resetSportsWebSocketEngineForTests: vi.fn(),
}));

const mockedPrune = vi.mocked(pruneStaleSportsGameStates);

function createSportsGame(
  overrides: Partial<SportsGame> & Pick<SportsGame, 'gameId' | 'slug' | 'title'>,
): SportsGame {
  return {
    eventId: overrides.gameId,
    league: 'MLB',
    leagueId: 'mlb',
    volume: 1_000,
    matchupKey: overrides.title.toLowerCase().replace(/\s+/g, '-'),
    teams: [
      { id: 1, name: 'Home', abbreviation: 'HOM' },
      { id: 2, name: 'Away', abbreviation: 'AWY' },
    ],
    tags: ['sports'],
    ...overrides,
  };
}

describe('useSportsGameResults', () => {
  beforeEach(() => {
    mockRelease.mockClear();
    mockAcquire.mockClear();
    mockedPrune.mockClear();
  });

  afterEach(() => {
    resetSportsWebSocketEngineForTests();
  });

  it('prunes stale game state for visible game ids', async () => {
    const games = [
      createSportsGame({
        gameId: 'game-1',
        slug: 'home-away-1',
        title: 'Home vs Away 1',
      }),
      createSportsGame({
        gameId: 'game-2',
        slug: 'home-away-2',
        title: 'Home vs Away 2',
      }),
    ];

    renderHookWithProviders(() => useSportsGameResults(games));

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockedPrune).toHaveBeenCalledWith(
      new Set([
        'game-1',
        'home-away-1',
        'home-vs-away-1',
        'game-2',
        'home-away-2',
        'home-vs-away-2',
      ]),
    );
  });

  it('acquires the sports websocket engine when game ids are present', async () => {
    const jotaiStore = createJotaiStore();
    const game = createSportsGame({
      gameId: 'game-1',
      slug: 'home-away',
      title: 'Home vs Away',
    });

    renderHookWithProviders(() => useSportsGameResults([game]), { jotaiStore });

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockAcquire).toHaveBeenCalledWith(jotaiStore);
  });

  it('does not acquire the websocket engine when game ids are empty', async () => {
    renderHookWithProviders(() => useSportsGameResults([]));

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockAcquire).not.toHaveBeenCalled();
  });

  it('releases the websocket lease on unmount', async () => {
    const game = createSportsGame({
      gameId: 'game-1',
      slug: 'home-away',
      title: 'Home vs Away',
    });
    const { unmount } = renderHookWithProviders(() => useSportsGameResults([game]));

    await act(async () => {
      await Promise.resolve();
    });

    unmount();

    expect(mockRelease).toHaveBeenCalledTimes(1);
  });

  it('re-subscribes when visible game ids change', async () => {
    const gameOne = createSportsGame({
      gameId: 'game-1',
      slug: 'home-away-1',
      title: 'Home vs Away 1',
    });
    const gameTwo = createSportsGame({
      gameId: 'game-2',
      slug: 'home-away-2',
      title: 'Home vs Away 2',
    });
    const { rerender } = renderHookWithProviders(
      ({ games }: { games: SportsGame[] }) => useSportsGameResults(games),
      { initialProps: { games: [gameOne] } },
    );

    await act(async () => {
      await Promise.resolve();
    });

    mockRelease.mockClear();
    mockAcquire.mockClear();

    rerender({ games: [gameTwo] });

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockRelease).toHaveBeenCalledTimes(1);
    expect(mockAcquire).toHaveBeenCalledTimes(1);
    expect(mockedPrune).toHaveBeenCalledWith(
      new Set(['game-2', 'home-away-2', 'home-vs-away-2']),
    );
  });
});
