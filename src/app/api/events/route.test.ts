import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

const cacheMocks = vi.hoisted(() => ({
  getCachedAggregatedEvents: vi.fn(),
  getCachedOpenEventsByTag: vi.fn(),
}));

vi.mock('@/lib/api/eventsServerCache', () => cacheMocks);

describe('/api/events route', () => {
  beforeEach(() => {
    cacheMocks.getCachedAggregatedEvents.mockReset();
    cacheMocks.getCachedOpenEventsByTag.mockReset();
  });

  it('returns aggregated events with cache headers', async () => {
    cacheMocks.getCachedAggregatedEvents.mockResolvedValue([{ id: 'event-1' }]);

    const response = await GET(new Request('http://localhost/api/events'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([{ id: 'event-1' }]);
    expect(response.headers.get('Cache-Control')).toBe(
      'public, s-maxage=60, stale-while-revalidate=120',
    );
  });

  it('uses a valid tag query parameter for category events', async () => {
    cacheMocks.getCachedOpenEventsByTag.mockResolvedValue([{ id: 'crypto-1' }]);

    const response = await GET(
      new Request('http://localhost/api/events?tag=crypto'),
    );

    expect(cacheMocks.getCachedOpenEventsByTag).toHaveBeenCalledWith('crypto');
    expect(await response.json()).toEqual([{ id: 'crypto-1' }]);
  });

  it('returns a 500 JSON error when loading fails', async () => {
    cacheMocks.getCachedAggregatedEvents.mockRejectedValue(new Error('cache down'));

    const response = await GET(new Request('http://localhost/api/events'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'cache down' });
  });
});
