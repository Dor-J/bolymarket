import { describe, expect, it } from 'vitest';
import { createMockEvent } from '@/test/fixtures/events';
import { eventMatchesSearch, filterEventsBySearch } from './search';

describe('eventMatchesSearch', () => {
  const event = createMockEvent({
    id: '1',
    slug: 'bitcoin-etf',
    title: 'Bitcoin ETF approved?',
    category: 'crypto',
    tags: ['crypto', 'finance'],
    markets: [
      {
        id: 'm1',
        question: 'Will BTC hit 100k?',
        volume: 100,
        outcomes: [{ id: 'yes', name: 'Yes', price: 0.5 }],
      },
    ],
  });

  it('matches all events when query is empty', () => {
    expect(eventMatchesSearch(event, '')).toBe(true);
    expect(eventMatchesSearch(event, '   ')).toBe(true);
  });

  it('matches title, slug, tags, category, and market question', () => {
    expect(eventMatchesSearch(event, 'bitcoin')).toBe(true);
    expect(eventMatchesSearch(event, 'etf')).toBe(true);
    expect(eventMatchesSearch(event, 'finance')).toBe(true);
    expect(eventMatchesSearch(event, '100k')).toBe(true);
    expect(eventMatchesSearch(event, 'nfl')).toBe(false);
  });
});

describe('filterEventsBySearch', () => {
  it('returns only matching events', () => {
    const events = [
      createMockEvent({ id: '1', slug: 'a', title: 'Alpha' }),
      createMockEvent({ id: '2', slug: 'b', title: 'Beta crypto' }),
    ];

    expect(filterEventsBySearch(events, 'crypto')).toHaveLength(1);
    expect(filterEventsBySearch(events, 'crypto')[0]?.slug).toBe('b');
  });
});
