import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchEventBySlug, fetchOpenEvents, getOpenEvents } from './gamma';

const mockGammaEvent = {
  id: '1',
  slug: 'test-slug',
  title: 'Test Event',
  markets: [
    {
      id: 'm1',
      question: 'Will it happen?',
      outcomes: ['Yes', 'No'],
      outcomePrices: ['0.6', '0.4'],
      clobTokenIds: ['yes-token', 'no-token'],
    },
  ],
};

describe('fetchOpenEvents', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns normalized open events', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [mockGammaEvent],
      }),
    );

    const events = await fetchOpenEvents();

    expect(events).toHaveLength(1);
    expect(events[0]?.slug).toBe('test-slug');
  });

  it('passes limit query params when provided', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [],
    });
    vi.stubGlobal('fetch', fetchMock);

    await fetchOpenEvents({ limit: 25 });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('limit=25'),
      expect.any(Object),
    );
  });

  it('throws on API errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      }),
    );

    await expect(fetchOpenEvents()).rejects.toThrow(
      'Gamma API error: 500 Internal Server Error',
    );
  });

  it('aliases getOpenEvents to fetchOpenEvents', () => {
    expect(getOpenEvents).toBe(fetchOpenEvents);
  });
});

describe('fetchEventBySlug', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns a normalized event when the slug matches', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [mockGammaEvent],
      }),
    );

    const event = await fetchEventBySlug('test-slug');

    expect(event?.slug).toBe('test-slug');
    expect(event?.title).toBe('Test Event');
  });

  it('returns null when the API responds with 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      }),
    );

    await expect(fetchEventBySlug('missing-slug')).resolves.toBeNull();
  });

  it('throws on network errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      }),
    );

    await expect(fetchEventBySlug('broken-slug')).rejects.toThrow(
      'Gamma API error: 500 Internal Server Error',
    );
  });
});
