import { describe, expect, it } from 'vitest';
import {
  mapCategoryToNewsSections,
  rankRelatedNews,
  scoreNewsArticle,
  tokenizeForNewsMatch,
} from './rankRelatedNews';
import type { NewsArticle } from './types';

describe('tokenizeForNewsMatch', () => {
  it('removes stop words and short tokens', () => {
    expect(tokenizeForNewsMatch('Will the World Cup be won?')).toEqual([
      'world',
      'cup',
      'won',
    ]);
  });
});

describe('mapCategoryToNewsSections', () => {
  it('maps sports events to Sports section', () => {
    expect(mapCategoryToNewsSections('sports', ['soccer'])).toContain('Sports');
  });

  it('maps crypto events to Technology', () => {
    expect(mapCategoryToNewsSections('crypto', ['bitcoin'])).toContain(
      'Technology',
    );
  });
});

describe('scoreNewsArticle', () => {
  it('scores overlapping headlines higher', () => {
    const article: NewsArticle = {
      title: 'France leads World Cup odds before kickoff',
      link: 'https://example.com/france',
    };

    const score = scoreNewsArticle(article, {
      title: 'World Cup Winner',
      category: 'sports',
      tags: ['soccer', 'france'],
    });

    expect(score).toBeGreaterThan(2);
  });
});

describe('rankRelatedNews', () => {
  it('returns only articles above the minimum score', () => {
    const articles: NewsArticle[] = [
      {
        title: 'France leads World Cup odds before kickoff',
        link: 'https://example.com/france',
      },
      {
        title: 'Unrelated celebrity gossip update',
        link: 'https://example.com/gossip',
      },
    ];

    const ranked = rankRelatedNews(
      articles,
      {
        title: 'World Cup Winner',
        tags: ['soccer', 'france'],
      },
      6,
      2,
    );

    expect(ranked).toHaveLength(1);
    expect(ranked[0]?.title).toContain('France');
  });
});
