# API docs page

Route: `/api-docs` → `page.tsx`

Renders interactive **Swagger UI** for the bolymarket REST API using `swagger-ui-dist`
(Turbopack-compatible; no `swagger-ui-react`).

## Components

| File | Role |
| ---- | ---- |
| `page.tsx` | Server route — mounts the docs shell |
| `components/api-docs/SwaggerUiClient.tsx` | Client wrapper — loads spec from `/api/openapi` |

## OpenAPI source

Spec is generated in `lib/openapi/spec.ts` and served at `GET /api/openapi`.

## App shell

`AppShell` skips chrome (header, nav, footer) on `/api-docs` so Swagger fills the viewport.

## Local usage

```bash
bun run dev
# open http://localhost:3000/api-docs
```
