import type { NewsArticle, RankedNewsArticle, RelatedNewsInput } from './types';

const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'of',
  'in',
  'on',
  'at',
  'to',
  'for',
  'will',
  'be',
  'is',
  'by',
  'with',
  'this',
  'that',
  'from',
]);

/**
 * Tokenizes text into lowercase keywords for overlap scoring.
 */
export function tokenizeForNewsMatch(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

/**
 * Maps event metadata to likely OkSurf section names.
 */
export function mapCategoryToNewsSections(
  category?: string,
  tags: string[] = [],
): string[] {
  const normalized = [category, ...tags]
    .filter(Boolean)
    .map((value) => value!.toLowerCase());

  const sections = new Set<string>(['World']);

  if (normalized.some((value) => value.includes('sport'))) {
    sections.add('Sports');
  }

  if (
    normalized.some(
      (value) =>
        value.includes('crypto') ||
        value.includes('bitcoin') ||
        value.includes('tech'),
    )
  ) {
    sections.add('Technology');
    sections.add('Business');
  }

  if (
    normalized.some(
      (value) =>
        value.includes('politic') ||
        value.includes('election') ||
        value.includes('president'),
    )
  ) {
    sections.add('US');
    sections.add('World');
  }

  if (normalized.some((value) => value.includes('business'))) {
    sections.add('Business');
  }

  if (normalized.some((value) => value.includes('health'))) {
    sections.add('Health');
  }

  if (normalized.some((value) => value.includes('science'))) {
    sections.add('Science');
  }

  return Array.from(sections);
}

/**
 * Scores how relevant an article headline is to an event.
 */
export function scoreNewsArticle(
  article: NewsArticle,
  input: RelatedNewsInput,
): number {
  const articleTokens = new Set(tokenizeForNewsMatch(article.title));
  const queryTokens = [
    ...tokenizeForNewsMatch(input.title),
    ...tokenizeForNewsMatch(input.category ?? ''),
    ...input.tags.flatMap((tag) => tokenizeForNewsMatch(tag)),
    ...(input.marketQuestions ?? []).flatMap((question) =>
      tokenizeForNewsMatch(question),
    ),
  ];

  let score = 0;

  for (const token of queryTokens) {
    if (articleTokens.has(token)) {
      score += 2;
    }
  }

  const titleLower = input.title.toLowerCase();
  const articleLower = article.title.toLowerCase();

  if (titleLower.length > 8 && articleLower.includes(titleLower.slice(0, 12))) {
    score += 3;
  }

  return score;
}

/**
 * Ranks articles by relevance to an event and returns the top matches.
 */
export function rankRelatedNews(
  articles: NewsArticle[],
  input: RelatedNewsInput,
  limit = 6,
  minScore = 2,
): RankedNewsArticle[] {
  const ranked = articles
    .map((article) => ({
      ...article,
      score: scoreNewsArticle(article, input),
    }))
    .filter((article) => article.score >= minScore)
    .sort((left, right) => right.score - left.score);

  return ranked.slice(0, limit);
}
