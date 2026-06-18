import 'server-only';

import { createHash } from 'node:crypto';
import { readServerCache, writeServerCache } from '@/lib/cache/serverCache';
import type { CacheEnvelope } from '@/lib/cache/types';
import { fetchGdeltRelatedNews } from './gdelt';
import { fetchOkSurfNewsSections } from './oksurf';
import { mapCategoryToNewsSections } from './rankRelatedNews';
import type { NewsArticle, RelatedNewsInput } from './types';

const NEWS_CACHE_TTL_MS = 5 * 60_000;
const GDELT_TIMEOUT_MS = 8_000;

type CacheReader = (key: string) => Promise<CacheEnvelope<NewsArticle[]> | null>;
type CacheWriter = (
  key: string,
  data: NewsArticle[],
  ttlMs: number,
) => Promise<CacheEnvelope<NewsArticle[]>>;

interface RelatedNewsDependencies {
  readCache?: CacheReader;
  writeCache?: CacheWriter;
  fetchGdelt?: (
    options: RelatedNewsInput & { signal?: AbortSignal },
  ) => Promise<NewsArticle[]>;
  fetchOkSurf?: (sections: string[]) => Promise<NewsArticle[]>;
  timeoutMs?: number;
}

/**
 * Fetches event-related headlines from GDELT, falling back to OkSurf on timeout or failure.
 */
export async function fetchRelatedNewsArticles(
  input: RelatedNewsInput,
  dependencies: RelatedNewsDependencies = {},
): Promise<NewsArticle[]> {
  const readCache =
    dependencies.readCache ??
    ((key: string) => readServerCache<NewsArticle[]>(key));
  const writeCache =
    dependencies.writeCache ??
    ((key: string, data: NewsArticle[], ttlMs: number) =>
      writeServerCache(key, data, ttlMs));
  const fetchGdelt = dependencies.fetchGdelt ?? fetchGdeltRelatedNews;
  const fetchOkSurf = dependencies.fetchOkSurf ?? fetchOkSurfNewsSections;
  const timeoutMs = dependencies.timeoutMs ?? GDELT_TIMEOUT_MS;
  const gdeltCacheKey = `bolymarket:gdelt-news:${hashRelatedNewsInput(input)}`;
  const cachedGdeltArticles = await readCache(gdeltCacheKey);

  if (cachedGdeltArticles) {
    return cachedGdeltArticles.data;
  }

  try {
    const gdeltArticles = await runWithTimeout(
      (signal) => fetchGdelt({ ...input, signal }),
      timeoutMs,
    );

    if (gdeltArticles.length > 0) {
      return (
        await writeCache(gdeltCacheKey, gdeltArticles, NEWS_CACHE_TTL_MS)
      ).data;
    }
  } catch {
    // OkSurf is intentionally silent fallback for GDELT availability issues.
  }

  return fetchOkSurfFallback(input, { readCache, writeCache, fetchOkSurf });
}

/**
 * Runs an abortable async operation with an explicit timeout.
 */
export async function runWithTimeout<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number,
): Promise<T> {
  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      operation(controller.signal),
      new Promise<T>((_, reject) => {
        timeout = setTimeout(() => {
          controller.abort();
          reject(new Error(`Operation timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}

async function fetchOkSurfFallback(
  input: RelatedNewsInput,
  dependencies: Required<Pick<RelatedNewsDependencies, 'readCache' | 'writeCache' | 'fetchOkSurf'>>,
): Promise<NewsArticle[]> {
  const sections = mapCategoryToNewsSections(input.category, input.tags);
  const cacheKey = `bolymarket:oksurf-news:${sections.join(',')}`;
  const cachedArticles = await dependencies.readCache(cacheKey);

  if (cachedArticles) {
    return cachedArticles.data;
  }

  try {
    const articles = (await dependencies.fetchOkSurf(sections)).map((article) => ({
      ...article,
      provider: 'oksurf' as const,
    }));

    if (articles.length === 0) {
      return [];
    }

    return (
      await dependencies.writeCache(cacheKey, articles, NEWS_CACHE_TTL_MS)
    ).data;
  } catch {
    return [];
  }
}

function hashRelatedNewsInput(input: RelatedNewsInput): string {
  return createHash('sha256')
    .update(
      JSON.stringify({
        title: input.title,
        category: input.category ?? '',
        tags: input.tags,
        marketQuestions: input.marketQuestions ?? [],
      }),
    )
    .digest('hex')
    .slice(0, 24);
}
