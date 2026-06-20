import { NextResponse } from 'next/server';
import { fetchTradeHistory } from '@/lib/api/trades';
import { readServerCache, writeServerCache } from '@/lib/cache/serverCache';

const TRADE_HISTORY_CACHE_TTL_MS = 30_000;

/**
 * Returns recent public Polymarket trades for an event.
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId')?.trim();
    const eventSlug = searchParams.get('eventSlug')?.trim();
    const limitValue = searchParams.get('limit');
    const limit = limitValue ? Number(limitValue) : undefined;

    if (!eventId || !eventSlug) {
      return NextResponse.json(
        { error: 'Missing eventId or eventSlug' },
        { status: 400 },
      );
    }

    if (limit !== undefined && (!Number.isFinite(limit) || limit <= 0)) {
      return NextResponse.json({ error: 'Invalid limit' }, { status: 400 });
    }

    const cacheKey = `bolymarket:trades:${eventId}:${eventSlug}:${limit ?? 'default'}`;
    const cached = await readServerCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=60',
        },
      });
    }

    const trades = await fetchTradeHistory(eventId, eventSlug, { limit });
    await writeServerCache(cacheKey, trades, TRADE_HISTORY_CACHE_TTL_MS);

    return NextResponse.json(trades, {
      headers: {
        'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load trade history';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
