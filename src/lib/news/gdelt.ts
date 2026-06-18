import 'server-only';

import { tokenizeForNewsMatch } from './rankRelatedNews';
import type { NewsArticle, RelatedNewsInput } from './types';

const GDELT_DOC_API_URL = 'https://api.gdeltproject.org/api/v2/doc/doc';
const DEFAULT_MAX_RECORDS = 50;
const DEFAULT_TIMESPAN = '7d';
const MAX_QUERY_TOKENS = 14;

interface GdeltArticleRecord {
  url?: unknown;
  title?: unknown;
  seendate?: unknown;
  domain?: unknown;
  socialimage?: unknown;
}

interface GdeltDocResponse {
  articles?: unknown;
}

export interface FetchGdeltNewsOptions extends RelatedNewsInput {
  signal?: AbortSignal;
  maxRecords?: number;
  timespan?: string;
}

/**
 * Builds a concise GDELT search query from event context.
 */
export function buildGdeltNewsQuery(input: RelatedNewsInput): string {
  const title = input.title.trim();
  const supportingTokens = [
    ...tokenizeForNewsMatch(input.category ?? ''),
    ...input.tags.flatMap((tag) => tokenizeForNewsMatch(tag)),
    ...(input.marketQuestions ?? []).flatMap((question) =>
      tokenizeForNewsMatch(question),
    ),
  ];
  const titleTokens = new Set(tokenizeForNewsMatch(title));
  const dedupedSupportingTokens = Array.from(new Set(supportingTokens))
    .filter((token) => !titleTokens.has(token))
    .slice(0, MAX_QUERY_TOKENS);

  return [title, ...dedupedSupportingTokens].filter(Boolean).join(' ').trim();
}

/**
 * Fetches related articles from GDELT DOC 2.0 and normalizes them for the UI.
 */
export async function fetchGdeltRelatedNews(
  options: FetchGdeltNewsOptions,
): Promise<NewsArticle[]> {
  const query = buildGdeltNewsQuery(options);

  if (!query) {
    return [];
  }

  const params = new URLSearchParams({
    query,
    mode: 'ArtList',
    format: 'json',
    maxrecords: String(options.maxRecords ?? DEFAULT_MAX_RECORDS),
    timespan: options.timespan ?? DEFAULT_TIMESPAN,
    sort: 'HybridRel',
  });

  const response = await fetch(`${GDELT_DOC_API_URL}?${params.toString()}`, {
    headers: { Accept: 'application/json' },
    signal: options.signal,
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`GDELT DOC API error: ${response.status}`);
  }

  const payload = (await response.json()) as GdeltDocResponse;
  return normalizeGdeltArticles(payload);
}

/**
 * Converts a GDELT DOC response into the shared related-news article shape.
 */
export function normalizeGdeltArticles(payload: unknown): NewsArticle[] {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const articles = (payload as GdeltDocResponse).articles;

  if (!Array.isArray(articles)) {
    return [];
  }

  const seen = new Set<string>();
  const normalized: NewsArticle[] = [];

  for (const value of articles) {
    const article = normalizeGdeltArticle(value);

    if (!article || seen.has(article.link)) {
      continue;
    }

    seen.add(article.link);
    normalized.push(article);
  }

  return normalized;
}

function normalizeGdeltArticle(value: unknown): NewsArticle | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as GdeltArticleRecord;

  if (typeof record.title !== 'string' || typeof record.url !== 'string') {
    return null;
  }

  const title = record.title.trim();
  const link = record.url.trim();

  if (!title || !link) {
    return null;
  }

  return {
    title,
    link,
    og: typeof record.socialimage === 'string' ? record.socialimage : undefined,
    source: getGdeltSourceName(record),
    publishedAt: typeof record.seendate === 'string' ? record.seendate : undefined,
    provider: 'gdelt',
  };
}

function getGdeltSourceName(record: GdeltArticleRecord): string | undefined {
  if (typeof record.domain !== 'string') {
    return undefined;
  }

  return record.domain.replace(/^www\./, '');
}
