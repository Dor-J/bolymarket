import { describe, expect, it } from 'vitest';
import {
  formatTradeActivityLine,
  formatTradeSizeUsd,
  getTradeNotionalUsd,
} from './formatTradeActivity';
import type { TradeActivityItem } from '@/lib/atoms/tradeActivity';

describe('formatTradeSizeUsd', () => {
  it('formats whole-dollar trade sizes', () => {
    expect(formatTradeSizeUsd(260)).toBe('$260');
    expect(formatTradeSizeUsd(94)).toBe('$94');
  });
});

describe('formatTradeActivityLine', () => {
  it('formats trades with pseudonym and outcome', () => {
    const trade: TradeActivityItem = {
      id: '1',
      eventSlug: 'world-cup',
      price: 0.114,
      side: 'BUY',
      timestamp: 1,
      userName: 'alpha-trader',
      outcome: 'France',
    };

    expect(formatTradeActivityLine(trade)).toEqual({
      title: 'alpha-trader',
      body: 'Bought France at 11.4¢',
    });
  });
});

describe('getTradeNotionalUsd', () => {
  it('returns size when present', () => {
    expect(
      getTradeNotionalUsd({
        id: '1',
        eventSlug: 'world-cup',
        price: 0.5,
        timestamp: 1,
        size: 260,
      }),
    ).toBe(260);
  });
});
