# API routes

Next.js App Router route handlers under `src/app/api/`. All routes return JSON unless noted.

| Route | Method | Description |
| ----- | ------ | ----------- |
| `/api/events` | GET | Open events list. Optional `?tag=crypto\|sports\|politics` |
| `/api/events/[slug]` | GET | Single normalized event by slug |
| `/api/prices/[tokenId]` | GET | CLOB price history. Optional `?timeframe=1d` |
| `/api/sports/live` | GET | Sports live games + league summaries (server-cached) |
| `/api/related-news` | GET | Related GDELT news articles for event context, with OkSurf fallback |
| `/api/openapi` | GET | OpenAPI 3.0 specification JSON |

## Caching

- **Server:** Redis when `REDIS_URL` is set; in-memory fallback otherwise (`lib/cache/serverCache.ts`).
- **Events:** Per-tag and aggregated caches in `lib/api/eventsServerCache.ts`.
- **Sports:** `lib/api/sportsServerCache.ts`.
- **Prices:** ~45s TTL on CLOB history responses.

## Implementation map

| Directory | Purpose |
| --------- | ------- |
| `events/` | Gamma fetch, Zod validation, normalization |
| `events/[slug]/` | Single-event lookup |
| `prices/[tokenId]/` | CLOB `/prices-history` proxy |
| `sports/live/` | Sports live games aggregation |
| `related-news/` | GDELT DOC 2.0 news proxy + ranking; OkSurf fallback after timeout/error |
| `openapi/` | Static spec from `lib/openapi/spec.ts` |

## Client access

Browser code must call these routes — never Gamma/CLOB directly:

- `lib/api/eventsClient.ts`
- `lib/api/pricesClient.ts`
- `lib/api/sportsClient.ts`
- `lib/api/relatedNewsClient.ts`

## Tests

API logic is tested in `lib/api/*.test.ts`, `lib/cache/*.test.ts`, and `lib/openapi/spec.test.ts`.
Route handlers are thin wrappers around those modules.

## Docs

Interactive explorer: [`/api-docs`](http://localhost:3000/api-docs) (Swagger UI).
