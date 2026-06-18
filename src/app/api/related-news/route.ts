import { NextResponse } from 'next/server';
import { fetchRelatedNewsArticles } from '@/lib/news/relatedNews';
import { rankRelatedNews } from '@/lib/news/rankRelatedNews';
import type { RankedNewsArticle } from '@/lib/news/types';

/**
 * Returns GDELT headlines ranked for relevance to an event, with OkSurf fallback.
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

    const articles = await fetchRelatedNewsArticles({
      title,
      category,
      tags,
      marketQuestions,
    });
    const rankedForEvent = rankRelatedNews(
      articles,
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
