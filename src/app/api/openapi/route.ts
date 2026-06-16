import { NextResponse } from 'next/server';
import { buildOpenApiSpec } from '@/lib/openapi/spec';

/**
 * Serves the OpenAPI 3.0 specification for bolymarket API routes.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const { origin } = new URL(request.url);
  const spec = buildOpenApiSpec({ serverUrl: origin });

  return NextResponse.json(spec, {
    headers: {
      'Cache-Control': 'public, max-age=300',
    },
  });
}
