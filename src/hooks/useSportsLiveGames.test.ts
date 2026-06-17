import { waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchSportsLiveClient } from '@/lib/api/sportsClient';
import type { SportsLiveResponse } from '@/types/polymarket';
import { renderHookWithProviders } from '@/test/test-utils';
import { sportsLiveQueryOptions, useSportsLiveGames } from './useSportsLiveGames';

vi.mock('@/lib/api/sportsClient', () => ({
  fetchSportsLiveClient: vi.fn(),
}));

const mockedFetchSportsLiveClient = vi.mocked(fetchSportsLiveClient);

const mockResponse: SportsLiveResponse = {
  games: [],
  leagues: [],
  fetchedAt: '2026-06-17T00:00:00.000Z',
};

describe('useSportsLiveGames', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exposes sports live query options', () => {
    expect(sportsLiveQueryOptions.queryKey).toEqual(['sports', 'live']);
    expect(sportsLiveQueryOptions.staleTime).toBe(60_000);
  });

  it('returns loading state initially', () => {
    mockedFetchSportsLiveClient.mockImplementation(
      () => new Promise(() => undefined),
    );

    const { result } = renderHookWithProviders(() => useSportsLiveGames());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('returns sports live data on success', async () => {
    mockedFetchSportsLiveClient.mockResolvedValue(mockResponse);

    const { result } = renderHookWithProviders(() => useSportsLiveGames());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockedFetchSportsLiveClient).toHaveBeenCalledTimes(1);
  });

  it('returns error on failure', async () => {
    mockedFetchSportsLiveClient.mockRejectedValue(new Error('Sports live API error'));

    const { result } = renderHookWithProviders(() => useSportsLiveGames());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(new Error('Sports live API error'));
  });
});
