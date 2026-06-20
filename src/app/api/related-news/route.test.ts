import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

const relatedNewsMocks = vi.hoisted(() => ({
  fetchRelatedNewsArticles: vi.fn(),
}));

const rankMocks = vi.hoisted(() => ({
  rankRelatedNews: vi.fn(),
}));

vi.mock('@/lib/news/relatedNews', () => relatedNewsMocks);
vi.mock('@/lib/news/rankRelatedNews', () => rankMocks);

describe('/api/related-news route', () => {
  beforeEach(() => {
    relatedNewsMocks.fetchRelatedNewsArticles.mockReset();
    rankMocks.rankRelatedNews.mockReset();
  });

  it('requires a title query parameter', async () => {
    const response = await GET(new Request('http://localhost/api/related-news'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Missing title' });
  });

  it('fetches and ranks related news from query params', async () => {
    const articles = [{ title: 'Raw article', url: 'https://example.com' }];
    const ranked = [{ title: 'Ranked article', url: 'https://example.com', score: 2 }];
    relatedNewsMocks.fetchRelatedNewsArticles.mockResolvedValue(articles);
    rankMocks.rankRelatedNews.mockReturnValue(ranked);

    const response = await GET(
      new Request(
        'http://localhost/api/related-news?title=Election&category=politics&tags=us,vote&questions=Will%20A%20win%3F|Will%20B%20win%3F',
      ),
    );

    expect(relatedNewsMocks.fetchRelatedNewsArticles).toHaveBeenCalledWith({
      title: 'Election',
      category: 'politics',
      tags: ['us', 'vote'],
      marketQuestions: ['Will A win?', 'Will B win?'],
    });
    expect(rankMocks.rankRelatedNews).toHaveBeenCalledWith(
      articles,
      {
        title: 'Election',
        category: 'politics',
        tags: ['us', 'vote'],
        marketQuestions: ['Will A win?', 'Will B win?'],
      },
      6,
    );
    expect(await response.json()).toEqual(ranked);
    expect(response.headers.get('Cache-Control')).toBe(
      'public, s-maxage=120, stale-while-revalidate=300',
    );
  });

  it('returns a 500 JSON error when loading fails', async () => {
    relatedNewsMocks.fetchRelatedNewsArticles.mockRejectedValue(
      new Error('news down'),
    );

    const response = await GET(
      new Request('http://localhost/api/related-news?title=Election'),
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'news down' });
  });
});
