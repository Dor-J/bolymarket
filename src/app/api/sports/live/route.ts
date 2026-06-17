import { NextResponse } from 'next/server';
import { getCachedSportsLiveGames } from '@/lib/api/sportsServerCache';

/**
 * Returns live sports games with league summaries for the sports live page.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const payload = await getCachedSportsLiveGames();

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load sports live games';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
