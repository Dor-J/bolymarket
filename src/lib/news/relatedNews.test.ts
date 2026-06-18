import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CacheEnvelope } from '@/lib/cache/types';
import { fetchRelatedNewsArticles } from './relatedNews';
import type { NewsArticle } from './types';

const gdeltArticle: NewsArticle = {
  title: 'Anthropic restores access',
  link: 'https://example.com/gdelt',
  source: 'example.com',
  provider: 'gdelt',
};

const okSurfArticle: NewsArticle = {
  title: 'Anthropic fallback headline',
  link: 'https://example.com/oksurf',
  source: 'Fallback News',
};

function createCacheEnvelope<T>(data: T): CacheEnvelope<T> {
  return {
    data,
    cachedAt: 0,
    expiresAt: 60_000,
  };
}

const readCache = vi.fn(
  async (): Promise<CacheEnvelope<NewsArticle[]> | null> => null,
);
const writeCache = vi.fn(
  async (
    _key: string,
    data: NewsArticle[],
  ): Promise<CacheEnvelope<NewsArticle[]>> =>
    createCacheEnvelope(data),
);

describe('fetchRelatedNewsArticles', () => {
  beforeEach(() => {
    readCache.mockClear();
    writeCache.mockClear();
  });

  it('returns cached GDELT articles before calling providers', async () => {
    const fetchGdelt = vi.fn();
    const fetchOkSurf = vi.fn();
    readCache.mockResolvedValueOnce(createCacheEnvelope([gdeltArticle]));

    const articles = await fetchRelatedNewsArticles(
      { title: 'Claude access', tags: [] },
      { readCache, writeCache, fetchGdelt, fetchOkSurf },
    );

    expect(articles).toEqual([gdeltArticle]);
    expect(fetchGdelt).not.toHaveBeenCalled();
    expect(fetchOkSurf).not.toHaveBeenCalled();
  });

  it('uses GDELT when it returns articles', async () => {
    const fetchGdelt = vi.fn(async () => [gdeltArticle]);
    const fetchOkSurf = vi.fn();

    const articles = await fetchRelatedNewsArticles(
      { title: 'Claude access', tags: [] },
      { readCache, writeCache, fetchGdelt, fetchOkSurf },
    );

    expect(articles).toEqual([gdeltArticle]);
    expect(fetchOkSurf).not.toHaveBeenCalled();
    expect(writeCache).toHaveBeenCalledWith(
      expect.stringContaining('bolymarket:gdelt-news:'),
      [gdeltArticle],
      300_000,
    );
  });

  it('falls back to OkSurf when GDELT fails', async () => {
    const fetchGdelt = vi.fn(async () => {
      throw new Error('GDELT unavailable');
    });
    const fetchOkSurf = vi.fn(async () => [okSurfArticle]);

    const articles = await fetchRelatedNewsArticles(
      { title: 'Claude access', category: 'technology', tags: [] },
      { readCache, writeCache, fetchGdelt, fetchOkSurf },
    );

    expect(articles).toEqual([{ ...okSurfArticle, provider: 'oksurf' }]);
    expect(fetchOkSurf).toHaveBeenCalledWith(['World', 'Technology', 'Business']);
  });

  it('falls back to OkSurf when GDELT times out', async () => {
    vi.useFakeTimers();

    const fetchGdelt = vi.fn(
      () => new Promise<NewsArticle[]>(() => undefined),
    );
    const fetchOkSurf = vi.fn(async () => [okSurfArticle]);
    const result = fetchRelatedNewsArticles(
      { title: 'Claude access', tags: [] },
      {
        readCache,
        writeCache,
        fetchGdelt,
        fetchOkSurf,
        timeoutMs: 10,
      },
    );

    await vi.advanceTimersByTimeAsync(10);
    await expect(result).resolves.toEqual([
      { ...okSurfArticle, provider: 'oksurf' },
    ]);

    vi.useRealTimers();
  });

  it('returns an empty list when both providers fail', async () => {
    const fetchGdelt = vi.fn(async () => []);
    const fetchOkSurf = vi.fn(async () => {
      throw new Error('OkSurf unavailable');
    });

    await expect(
      fetchRelatedNewsArticles(
        { title: 'Claude access', tags: [] },
        { readCache, writeCache, fetchGdelt, fetchOkSurf },
      ),
    ).resolves.toEqual([]);
  });
});
