import { describe, expect, it } from 'vitest';
import { createMockEvent } from '@/test/fixtures/events';
import { filterByTopic, sortEvents } from '@/lib/markets/filterEvents';
import { POLITICS_TOPIC_CHIPS } from '@/lib/markets/constants';
import { CRYPTO_MARKET_TYPE_TABS } from '@/lib/markets/constants';
import { filterByMarketType } from '@/lib/markets/filterEvents';

describe('filterEvents', () => {
  it('filters politics events by trump chip', () => {
    const events = [
      createMockEvent({ id: '1', slug: 'a', title: 'Trump approval rating' }),
      createMockEvent({ id: '2', slug: 'b', title: 'Bitcoin price' }),
    ];

    const filtered = filterByTopic(events, 'trump', POLITICS_TOPIC_CHIPS);
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.title).toContain('Trump');
  });

  it('sorts events by volume descending', () => {
    const events = [
      createMockEvent({ id: '1', slug: 'a', title: 'Low', volume: 10 }),
      createMockEvent({ id: '2', slug: 'b', title: 'High', volume: 100 }),
    ];

    const sorted = sortEvents(events, 'volume');
    expect(sorted[0]?.volume).toBe(100);
  });

  it('filters crypto up/down markets by type tab', () => {
    const events = [
      createMockEvent({ id: '1', slug: 'a', title: 'BTC Up or Down 5m' }),
      createMockEvent({ id: '2', slug: 'b', title: 'Who wins election?' }),
    ];

    const filtered = filterByMarketType(events, 'up-down', CRYPTO_MARKET_TYPE_TABS);
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.title).toContain('Up or Down');
  });
});
