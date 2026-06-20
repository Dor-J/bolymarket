import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchSportsLiveClient } from './sportsClient';

describe('fetchSportsLiveClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches sports live payload with JSON headers and abort signal', async () => {
    const signal = new AbortController().signal;
    const payload = {
      games: [],
      futuresGames: [],
      leagues: [],
      fetchedAt: '2026-06-20T00:00:00.000Z',
    };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => payload,
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchSportsLiveClient({ signal })).resolves.toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith('/api/sports/live', {
      headers: { Accept: 'application/json' },
      signal,
    });
  });

  it('throws a useful error for non-OK responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
      }),
    );

    await expect(fetchSportsLiveClient()).rejects.toThrow(
      'Sports live API error: 503 Service Unavailable',
    );
  });
});
