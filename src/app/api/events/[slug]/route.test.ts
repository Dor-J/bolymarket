import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

const cacheMocks = vi.hoisted(() => ({
  getCachedEventBySlug: vi.fn(),
}));

vi.mock('@/lib/api/eventsServerCache', () => cacheMocks);

describe('/api/events/[slug] route', () => {
  beforeEach(() => {
    cacheMocks.getCachedEventBySlug.mockReset();
  });

  it('returns an event by slug with cache headers', async () => {
    cacheMocks.getCachedEventBySlug.mockResolvedValue({
      id: 'event-1',
      slug: 'event-slug',
    });

    const response = await GET(new Request('http://localhost/api/events/event-slug'), {
      params: Promise.resolve({ slug: 'event-slug' }),
    });

    expect(cacheMocks.getCachedEventBySlug).toHaveBeenCalledWith('event-slug');
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      id: 'event-1',
      slug: 'event-slug',
    });
    expect(response.headers.get('Cache-Control')).toBe(
      'public, s-maxage=60, stale-while-revalidate=120',
    );
  });

  it('returns 404 when the event is missing', async () => {
    cacheMocks.getCachedEventBySlug.mockResolvedValue(null);

    const response = await GET(new Request('http://localhost/api/events/missing'), {
      params: Promise.resolve({ slug: 'missing' }),
    });

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Event not found' });
  });

  it('returns a 500 JSON error when loading fails', async () => {
    cacheMocks.getCachedEventBySlug.mockRejectedValue(new Error('boom'));

    const response = await GET(new Request('http://localhost/api/events/bad'), {
      params: Promise.resolve({ slug: 'bad' }),
    });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'boom' });
  });
});
