# Shared library

Server and client utilities — API access, state atoms, realtime engines, formatters, and domain logic.
Components and hooks import from `@/lib/…`; avoid cross-importing between `app/` and `components/` except via `lib/`.

## Directory map

```text
lib/
├── a11y/           SSR-safe accessibility helpers (e.g. toggleAriaPressed)
├── api/            Gamma/CLOB fetch, Zod schemas, normalization, server caches
├── atoms/          Jotai atoms — prices, bookmarks, theme, trade activity, sports state
├── cache/          Redis/memory server cache, React Query IndexedDB persist
├── cards/          Event → card props mapping and variant resolution
├── chart/          Chart types, simulated history, timeframe helpers
├── constants/      Footer, categories, hot topics, events grid classes
├── event/          Event detail variant resolution
├── featured/       Featured carousel trade activity formatting
├── filters/        Client-side search helpers
├── format/         Volume, market count, price display formatters
├── markets/        Home filter/sort/topic logic
├── news/           Related news ranking (OKSurf)
├── openapi/        OpenAPI 3.0 spec generator
├── prices/         Outcome key helpers, visible outcome seed extraction
├── query/          React Query client factory
├── realtime/       WebSocket engines (prices, sports), simulation, trade parsing
├── share/          Web Share + clipboard helpers
└── sports/         Sports market classification, team labels, game card builder
```

## Data boundaries

| Concern | Layer | Notes |
| ------- | ----- | ----- |
| Structural event data | React Query | Never write live prices back into query cache |
| Live outcome prices | Jotai `outcomePriceAtomFamily` | Keyed `${marketId}:${outcomeId}` |
| UI filters / search | Jotai atoms | `searchQueryAtom`, `marketFiltersVisibleAtom`, etc. |
| Sports game state | Jotai `sportsGameState` | Updated via sports WebSocket |

## Realtime

| Module | Purpose |
| ------ | ------- |
| `livePriceEngineManager.ts` | Ref-counted shared price engine |
| `websocketEngine.ts` | Polymarket activity WebSocket → price atoms |
| `simulationEngine.ts` | Random-walk fallback |
| `sportsWebSocketEngine.ts` | Sports live scores / game updates |
| `tradePayload.ts` | Parse WS trade payloads for featured activity |

Mode: `NEXT_PUBLIC_LIVE_PRICE_MODE` (`auto` | `websocket` | `simulation`).

## Testing

Lib modules colocate `*.test.ts` with source. Run:

```bash
bun run test src/lib
```

Key suites: `api/gamma.test.ts`, `api/clob.test.ts`, `realtime/livePriceEngineManager.test.ts`,
`markets/filterEvents.test.ts`, `cache/serverCache.test.ts`, `openapi/spec.test.ts`.

## Conventions

- Zod-validate external API responses in `api/schemas.ts` before normalization.
- Export domain types from `types/polymarket.ts` — lib produces normalized shapes only.
- Server-only code (`redis.ts`, `eventsServerCache.ts`) must not import client hooks.
