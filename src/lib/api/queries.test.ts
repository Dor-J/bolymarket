import { describe, expect, it } from 'vitest';
import { relatedNewsQueryOptions } from './queries';

describe('relatedNewsQueryOptions', () => {
  it('includes market questions in the query key', () => {
    const baseInput = {
      slug: 'btc-100k',
      title: 'Will Bitcoin hit 100k?',
      category: 'crypto',
      tags: ['bitcoin'],
    };

    const first = relatedNewsQueryOptions({
      ...baseInput,
      marketQuestions: ['Will BTC trade above 100k?'],
    });
    const second = relatedNewsQueryOptions({
      ...baseInput,
      marketQuestions: ['Will BTC trade below 100k?'],
    });

    expect(first.queryKey).not.toEqual(second.queryKey);
  });
});
