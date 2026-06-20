import { cleanup, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createStore } from 'jotai';
import { appendTradeActivity } from '@/lib/atoms/tradeActivity';
import type { TradeActivityItem } from '@/lib/atoms/tradeActivity';
import type { ChartOutcome } from '@/lib/chart/types';
import { createMockEvent } from '@/test/fixtures/events';
import { renderWithProviders } from '@/test/test-utils';
import { FeaturedBidRail, getFeaturedBidItems } from './FeaturedBidRail';

const outcomes: ChartOutcome[] = [
  {
    id: 'france-token',
    marketId: 'market-1',
    name: 'France',
    price: 0.18,
    color: '#74B9FF',
  },
  {
    id: 'spain-token',
    marketId: 'market-1',
    name: 'Spain',
    price: 0.14,
    color: '#FF8A00',
  },
];

const event = createMockEvent({
  id: '123',
  slug: 'world-cup-winner',
  title: 'World Cup Winner',
});

function trade(overrides: Partial<TradeActivityItem>): TradeActivityItem {
  return {
    id: 'trade-1',
    eventSlug: 'world-cup-winner',
    price: 0.18,
    timestamp: 1_781_700_000,
    assetId: 'france-token',
    size: 260,
    outcome: 'France',
    ...overrides,
  };
}

describe('getFeaturedBidItems', () => {
  it('renders live trades ahead of historical trades from the bottom', () => {
    const items = getFeaturedBidItems(
      [trade({ id: 'live', size: 500 })],
      [trade({ id: 'history', size: 260, timestamp: 1_781_699_000 })],
      outcomes,
    );

    expect(items.map((item) => item.size)).toEqual([260, 500]);
  });

  it('dedupes live and historical trades by transaction hash', () => {
    const items = getFeaturedBidItems(
      [trade({ id: 'live', transactionHash: '0xhash', size: 500 })],
      [trade({ id: 'history', transactionHash: '0xhash', size: 500 })],
      outcomes,
    );

    expect(items).toHaveLength(1);
    expect(items[0]?.size).toBe(500);
  });

  it('returns no items when all trades are missing notionals', () => {
    expect(
      getFeaturedBidItems(
        [trade({ id: 'live', size: undefined })],
        [],
        outcomes,
      ),
    ).toEqual([]);
  });
});

describe('FeaturedBidRail', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders historical trades when live activity is empty', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: 'history',
            eventSlug: 'world-cup-winner',
            price: 0.18,
            timestamp: 1_781_700_000,
            assetId: 'france-token',
            size: 260,
            outcome: 'France',
          },
        ],
      }),
    );

    renderWithProviders(<FeaturedBidRail event={event} outcomes={outcomes} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Recent trade sizes')).toBeInTheDocument();
    });
    expect(screen.getByText('$260')).toBeInTheDocument();
  });

  it('renders live activity before historical activity', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: 'history',
            eventSlug: 'world-cup-winner',
            price: 0.14,
            timestamp: 1_781_699_000,
            assetId: 'spain-token',
            size: 260,
            outcome: 'Spain',
          },
        ],
      }),
    );
    const jotaiStore = createStore();
    appendTradeActivity(jotaiStore, 'world-cup-winner', {
      price: 0.18,
      timestamp: 1_781_700_000,
      assetId: 'france-token',
      size: 500,
      outcome: 'France',
    });

    renderWithProviders(<FeaturedBidRail event={event} outcomes={outcomes} />, {
      jotaiStore,
    });

    await waitFor(() => {
      expect(screen.getByText('$500')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('$260')).toBeInTheDocument();
    });
  });
});
