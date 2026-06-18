import { describe, expect, it } from 'vitest';
import { buildGdeltNewsQuery, normalizeGdeltArticles } from './gdelt';

describe('buildGdeltNewsQuery', () => {
  it('combines event title with deduped supporting tokens', () => {
    const query = buildGdeltNewsQuery({
      title: 'Claude Fable 5 restored for US customers by June?',
      category: 'technology',
      tags: ['AI', 'Anthropic'],
      marketQuestions: [
        'Will Anthropic restore Claude Fable 5 access for US customers?',
      ],
    });

    expect(query).toContain('Claude Fable 5 restored');
    expect(query).toContain('technology');
    expect(query).toContain('anthropic');
    expect(query.toLowerCase().match(/claude/g)).toHaveLength(1);
  });
});

describe('normalizeGdeltArticles', () => {
  it('normalizes valid GDELT articles and removes duplicate URLs', () => {
    const articles = normalizeGdeltArticles({
      articles: [
        {
          title: 'Anthropic restores access',
          url: 'https://example.com/anthropic',
          domain: 'www.example.com',
          seendate: '20260614T070000Z',
          socialimage: 'https://example.com/image.jpg',
        },
        {
          title: 'Duplicate article',
          url: 'https://example.com/anthropic',
          domain: 'example.com',
        },
      ],
    });

    expect(articles).toEqual([
      {
        title: 'Anthropic restores access',
        link: 'https://example.com/anthropic',
        og: 'https://example.com/image.jpg',
        source: 'example.com',
        publishedAt: '20260614T070000Z',
        provider: 'gdelt',
      },
    ]);
  });

  it('returns an empty list for malformed payloads', () => {
    expect(normalizeGdeltArticles({ items: [] })).toEqual([]);
    expect(normalizeGdeltArticles(null)).toEqual([]);
  });
});
