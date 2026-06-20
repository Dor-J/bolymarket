import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

const clobMocks = vi.hoisted(() => ({
  fetchPriceHistory: vi.fn(),
}));

const cacheMocks = vi.hoisted(() => ({
  readServerCache: vi.fn(),
  writeServerCache: vi.fn(),
}));

vi.mock('@/lib/api/clob', () => clobMocks);
vi.mock('@/lib/cache/serverCache', () => cacheMocks);

describe('/api/prices/[tokenId] route', () => {
  beforeEach(() => {
    clobMocks.fetchPriceHistory.mockReset();
    cacheMocks.readServerCache.mockReset();
    cacheMocks.writeServerCache.mockReset();
  });

  it('returns cached price history when available', async () => {
    cacheMocks.readServerCache.mockResolvedValue({
      data: [{ timestamp: 1, price: 0.42 }],
    });

    const response = await GET(
      new Request('http://localhost/api/prices/token-1?timeframe=1h'),
      { params: Promise.resolve({ tokenId: 'token-1' }) },
    );

    expect(cacheMocks.readServerCache).toHaveBeenCalledWith(
      'bolymarket:prices:token-1:1h',
    );
    expect(clobMocks.fetchPriceHistory).not.toHaveBeenCalled();
    expect(await response.json()).toEqual([{ timestamp: 1, price: 0.42 }]);
    expect(response.headers.get('Cache-Control')).toBe(
      'public, s-maxage=30, stale-while-revalidate=60',
    );
  });

  it('fetches and caches price history on cache miss', async () => {
    cacheMocks.readServerCache.mockResolvedValue(null);
    clobMocks.fetchPriceHistory.mockResolvedValue([{ timestamp: 2, price: 0.5 }]);

    const response = await GET(new Request('http://localhost/api/prices/token-1'), {
      params: Promise.resolve({ tokenId: 'token-1' }),
    });

    expect(clobMocks.fetchPriceHistory).toHaveBeenCalledWith('token-1', '1d');
    expect(cacheMocks.writeServerCache).toHaveBeenCalledWith(
      'bolymarket:prices:token-1:1d',
      [{ timestamp: 2, price: 0.5 }],
      45_000,
    );
    expect(await response.json()).toEqual([{ timestamp: 2, price: 0.5 }]);
  });

  it('rejects invalid timeframes', async () => {
    const response = await GET(
      new Request('http://localhost/api/prices/token-1?timeframe=bad'),
      { params: Promise.resolve({ tokenId: 'token-1' }) },
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Invalid timeframe' });
  });
});
