import { NextResponse } from 'next/server';
import { readServerCache, writeServerCache } from '@/lib/cache/serverCache';
import { fetchOkSurfNewsSections } from '@/lib/news/oksurf';
import {
  mapCategoryToNewsSections,
  rankRelatedNews,
} from '@/lib/news/rankRelatedNews';
import type { NewsArticle, RankedNewsArticle } from '@/lib/news/types';

const NEWS_CACHE_TTL_MS = 5 * 60_000;

/**
 * Returns OkSurf headlines ranked for relevance to an event.
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title')?.trim();
    const category = searchParams.get('category')?.trim() || undefined;
    const tags = (searchParams.get('tags') ?? '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    const marketQuestions = (searchParams.get('questions') ?? '')
      .split('|')
      .map((question) => question.trim())
      .filter(Boolean);

    if (!title) {
      return NextResponse.json({ error: 'Missing title' }, { status: 400 });
    }

    const sections = mapCategoryToNewsSections(category, tags);
    const cacheKey = `bolymarket:oksurf-news:${sections.join(',')}`;
    let cachedArticles = await readServerCache<NewsArticle[]>(cacheKey);

    if (!cachedArticles) {
      const fetched = await fetchOkSurfNewsSections(sections);
      cachedArticles = await writeServerCache(
        cacheKey,
        fetched,
        NEWS_CACHE_TTL_MS,
      );
    }

    const rankedForEvent = rankRelatedNews(
      cachedArticles.data,
      { title, category, tags, marketQuestions },
      6,
    );

    return NextResponse.json(rankedForEvent as RankedNewsArticle[], {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load related news';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
