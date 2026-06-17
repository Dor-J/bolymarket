import { act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { pruneStaleSportsGameStates } from '@/lib/atoms/sportsGameState';
import { resetSportsWebSocketEngineForTests } from '@/lib/realtime/sportsWebSocketEngine';
import { createJotaiStore, renderHookWithProviders } from '@/test/test-utils';
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
    renderHookWithProviders(() => useSportsGameResults(['game-1', 'game-2']));

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockedPrune).toHaveBeenCalledWith(new Set(['game-1', 'game-2']));
  });

  it('acquires the sports websocket engine when game ids are present', async () => {
    const jotaiStore = createJotaiStore();

    renderHookWithProviders(() => useSportsGameResults(['game-1']), { jotaiStore });

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
    const { unmount } = renderHookWithProviders(() => useSportsGameResults(['game-1']));

    await act(async () => {
      await Promise.resolve();
    });

    unmount();

    expect(mockRelease).toHaveBeenCalledTimes(1);
  });

  it('re-subscribes when visible game ids change', async () => {
    const { rerender } = renderHookWithProviders(
      ({ gameIds }: { gameIds: string[] }) => useSportsGameResults(gameIds),
      { initialProps: { gameIds: ['game-1'] } },
    );

    await act(async () => {
      await Promise.resolve();
    });

    mockRelease.mockClear();
    mockAcquire.mockClear();

    rerender({ gameIds: ['game-2'] });

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockRelease).toHaveBeenCalledTimes(1);
    expect(mockAcquire).toHaveBeenCalledTimes(1);
    expect(mockedPrune).toHaveBeenCalledWith(new Set(['game-2']));
  });
});
