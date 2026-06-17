import type { RankedNewsArticle } from '@/lib/news/types';

export interface FetchRelatedNewsOptions {
  slug: string;
  title: string;
  category?: string;
  tags?: string[];
  marketQuestions?: string[];
  signal?: AbortSignal;
}

/**
 * Fetches ranked related headlines for a featured event preview.
 */
export async function fetchRelatedNewsClient(
  options: FetchRelatedNewsOptions,
): Promise<RankedNewsArticle[]> {
  const params = new URLSearchParams({
    slug: options.slug,
    title: options.title,
  });

  if (options.category) {
    params.set('category', options.category);
  }

  if (options.tags && options.tags.length > 0) {
    params.set('tags', options.tags.join(','));
  }

  if (options.marketQuestions && options.marketQuestions.length > 0) {
    params.set('questions', options.marketQuestions.join('|'));
  }

  const response = await fetch(`/api/related-news?${params.toString()}`, {
    headers: { Accept: 'application/json' },
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(
      `Related news API error: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as RankedNewsArticle[];
}
