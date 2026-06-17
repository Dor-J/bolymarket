import 'server-only';

import type { NewsArticle } from './types';

const OKSURF_BASE_URL = 'https://ok.surf/api/v1';

/**
 * Fetches articles for one or more OkSurf news sections.
 */
export async function fetchOkSurfNewsSections(
  sections: string[],
): Promise<NewsArticle[]> {
  if (sections.length === 0) {
    return fetchOkSurfNewsFeed();
  }

  const response = await fetch(`${OKSURF_BASE_URL}/news-section`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sections }),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`OkSurf section API error: ${response.status}`);
  }

  const payload = (await response.json()) as unknown;

  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.filter(isNewsArticle);
}

/**
 * Fetches the full OkSurf news feed.
 */
export async function fetchOkSurfNewsFeed(): Promise<NewsArticle[]> {
  const response = await fetch(`${OKSURF_BASE_URL}/news-feed`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`OkSurf feed API error: ${response.status}`);
  }

  const payload = (await response.json()) as unknown;

  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.filter(isNewsArticle);
}

function isNewsArticle(value: unknown): value is NewsArticle {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;
  return typeof record.title === 'string' && typeof record.link === 'string';
}
