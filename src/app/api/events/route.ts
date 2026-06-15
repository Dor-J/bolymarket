import { NextResponse } from "next/server";
import { getCachedAggregatedEvents } from "@/lib/api/eventsServerCache";

/**
 * Returns aggregated open events with Redis + in-memory server cache.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const events = await getCachedAggregatedEvents();
    return NextResponse.json(events, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load events";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
