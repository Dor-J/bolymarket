import { NextResponse } from 'next/server';
import {
  getCachedAggregatedEvents,
  getCachedOpenEventsByTag,
} from '@/lib/api/eventsServerCache';
import { isCategoryRouteSlug } from '@/lib/constants/categoryRoutes';

/**
 * Returns open events with Redis + in-memory server cache.
 * Optional `?tag=crypto|sports|politics` fetches a category-specific list.
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');

    const events =
      tag && isCategoryRouteSlug(tag)
        ? await getCachedOpenEventsByTag(tag)
        : await getCachedAggregatedEvents();

    return NextResponse.json(events, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load events';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
