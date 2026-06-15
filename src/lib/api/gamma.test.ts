import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchEventBySlug } from './gamma';

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
