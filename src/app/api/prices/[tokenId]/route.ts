import { NextResponse } from 'next/server';
import { fetchPriceHistory } from '@/lib/api/clob';
import type { Timeframe } from '@/lib/chart/types';
import { readServerCache, writeServerCache } from '@/lib/cache/serverCache';

const PRICE_CACHE_TTL_MS = 45_000;
const VALID_TIMEFRAMES = new Set<Timeframe>([
  '1h',
  '6h',
  '1d',
  '1w',
  '1m',
  'all',
]);

interface RouteContext {
  params: Promise<{ tokenId: string }>;
}

/**
 * Returns CLOB price history for a token with short-lived server cache.
 */
export async function GET(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    const { tokenId } = await context.params;
    const { searchParams } = new URL(request.url);
    const timeframe = (searchParams.get('timeframe') ?? '1d') as Timeframe;

    if (!VALID_TIMEFRAMES.has(timeframe)) {
      return NextResponse.json({ error: 'Invalid timeframe' }, { status: 400 });
    }

    const cacheKey = `bolymarket:prices:${tokenId}:${timeframe}`;
    const cached = await readServerCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      });
    }

    const history = await fetchPriceHistory(tokenId, timeframe);
    await writeServerCache(cacheKey, history, PRICE_CACHE_TTL_MS);

    return NextResponse.json(history, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load price history';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
