import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchRelatedNewsClient } from './relatedNewsClient';

describe('fetchRelatedNewsClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds the related news query string and forwards the abort signal', async () => {
    const signal = new AbortController().signal;
    const payload = [{ title: 'Article', url: 'https://example.com', score: 1 }];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => payload,
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      fetchRelatedNewsClient({
        slug: 'event-slug',
        title: 'Election?',
        category: 'politics',
        tags: ['us', 'vote'],
        marketQuestions: ['Will A win?', 'Will B win?'],
        signal,
      }),
    ).resolves.toEqual(payload);

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/related-news?slug=event-slug&title=Election%3F&category=politics&tags=us%2Cvote&questions=Will+A+win%3F%7CWill+B+win%3F',
      {
        headers: { Accept: 'application/json' },
        signal,
      },
    );
  });

  it('throws a useful error for non-OK responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      }),
    );

    await expect(
      fetchRelatedNewsClient({ slug: 'event-slug', title: 'Election?' }),
    ).rejects.toThrow('Related news API error: 500 Internal Server Error');
  });
});
