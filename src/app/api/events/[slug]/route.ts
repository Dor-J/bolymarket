import { NextResponse } from "next/server";
import { getCachedEventBySlug } from "@/lib/api/eventsServerCache";

interface EventRouteContext {
  params: Promise<{ slug: string }>;
}

/**
 * Returns a single event by slug with Redis + in-memory server cache.
 */
export async function GET(
  _request: Request,
  context: EventRouteContext,
): Promise<NextResponse> {
  const { slug } = await context.params;

  try {
    const event = await getCachedEventBySlug(slug);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load event";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
