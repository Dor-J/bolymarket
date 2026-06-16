import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { SwaggerUIClient } from '@/components/api-docs/SwaggerUIClient';
import { buildOpenApiSpec } from '@/lib/openapi/spec';
import './swagger-overrides.css';

export const metadata: Metadata = {
  title: 'API Docs — bolymarket',
  description: 'Interactive OpenAPI documentation for the bolymarket REST API.',
  robots: { index: false, follow: false },
};

/**
 * Swagger UI page — interactive API explorer at /api-docs.
 */
export default async function ApiDocsPage() {
  const headersList = await headers();
  const host = headersList.get('host') ?? 'localhost:3000';
  const protocol = headersList.get('x-forwarded-proto') ?? 'http';
  const spec = buildOpenApiSpec({ serverUrl: `${protocol}://${host}` });

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[1350px] items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              bolymarket
            </p>
            <h1 className="text-xl font-semibold text-text">API Reference</h1>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <a
              href="/api/openapi"
              className="text-brand hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenAPI JSON
            </a>
            <Link href="/" className="text-muted-foreground hover:text-text">
              ← Back to app
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1350px] px-6 py-6">
        <SwaggerUIClient spec={spec} />
      </main>
    </div>
  );
}
