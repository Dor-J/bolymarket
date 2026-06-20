import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchTradeHistory, normalizeDataApiTrades } from './trades';

describe('normalizeDataApiTrades', () => {
  it('maps Data API trades to trade activity items', () => {
    const trades = normalizeDataApiTrades(
      [
        {
          asset: 'token-1',
          price: 0.18,
          size: 260,
          timestamp: 1_781_700_000,
          eventSlug: 'world-cup-winner',
          outcome: 'France',
          side: 'BUY',
          pseudonym: 'polyfan',
          transactionHash: '0xtrade',
        },
      ],
      'fallback-event',
    );

    expect(trades).toEqual([
      expect.objectContaining({
        id: '0xtrade',
        transactionHash: '0xtrade',
        eventSlug: 'world-cup-winner',
        assetId: 'token-1',
        price: 0.18,
        size: 260,
        outcome: 'France',
        userName: 'polyfan',
      }),
    ]);
  });

  it('uses fallback event slug and usdcSize when needed', () => {
    const trades = normalizeDataApiTrades(
      [
        {
          asset_id: 'token-2',
          price: 1.4,
          usdcSize: 125,
          timestamp: 1_781_700_100,
          outcome: 'Spain',
        },
      ],
      'fallback-event',
    );

    expect(trades[0]).toMatchObject({
      eventSlug: 'fallback-event',
      assetId: 'token-2',
      price: 1,
      size: 125,
      outcome: 'Spain',
    });
  });
});

describe('fetchTradeHistory', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches and normalizes recent event trades', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          asset: 'token-1',
          price: 0.42,
          size: 500,
          timestamp: 1_781_700_000,
          eventSlug: 'event-slug',
        },
      ],
    });
    vi.stubGlobal('fetch', fetchMock);

    const trades = await fetchTradeHistory('123', 'event-slug', { limit: 6 });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://data-api.polymarket.com/trades?eventId=123&limit=6',
      expect.objectContaining({
        headers: { Accept: 'application/json' },
      }),
    );
    expect(trades).toHaveLength(1);
    expect(trades[0]).toMatchObject({
      eventSlug: 'event-slug',
      size: 500,
    });
  });
});
