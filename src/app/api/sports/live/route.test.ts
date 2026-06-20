import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

const sportsCacheMocks = vi.hoisted(() => ({
  getCachedSportsLiveGames: vi.fn(),
}));

vi.mock('@/lib/api/sportsServerCache', () => sportsCacheMocks);

describe('/api/sports/live route', () => {
  beforeEach(() => {
    sportsCacheMocks.getCachedSportsLiveGames.mockReset();
  });

  it('returns sports live payload with cache headers', async () => {
    const payload = {
      games: [],
      futuresGames: [],
      leagues: [],
      fetchedAt: '2026-06-20T00:00:00.000Z',
    };
    sportsCacheMocks.getCachedSportsLiveGames.mockResolvedValue(payload);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(payload);
    expect(response.headers.get('Cache-Control')).toBe(
      'public, s-maxage=60, stale-while-revalidate=120',
    );
  });

  it('returns a 500 JSON error when loading fails', async () => {
    sportsCacheMocks.getCachedSportsLiveGames.mockRejectedValue(
      new Error('sports down'),
    );

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'sports down' });
  });
});
