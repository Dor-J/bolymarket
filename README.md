# bolymarket

bolymarket is a Next.js App Router clone of the [Polymarket](https://polymarket.com) homepage and
event detail experience, built for the PLAEE frontend assignment. It focuses on UI fidelity,
responsive layouts, client-side category filtering, simulated live prices, and deliberate loading /
empty / error states — without trading, wallet, or auth.

## Setup

**Prerequisites:** [Bun](https://bun.sh) (recommended) or Node.js 20+.

No environment variables are required for local dev — the app reads public Gamma API data through
cached API routes. Optional:

| Variable | Purpose |
| -------- | ------- |
| `REDIS_URL` | Server-side cache for Gamma responses (e.g. `redis://localhost:6379`). Without it, an in-memory fallback is used. |
| `NEXT_PUBLIC_LIVE_PRICE_MODE` | `auto` (default) · `websocket` · `simulation` |

From the `bolymarket/` directory:

```bash
bun install
bun run dev        # http://localhost:3000
bun run build      # production build
bun run start      # serve production build
bun run test       # Vitest unit + component tests
bun run lint
bun run format:check
```

## Repository layout

This app is the git repository. It lives inside the broader `BoliMarket/` workspace, which also
contains `design-system/` and `plans/` reference material at the workspace root.

```text
BoliMarket/           # workspace root
├── design-system/
├── plans/
└── bolymarket/       # this repo — run all commands here
```

## Stack

- Next.js 16 (App Router)
- TypeScript (strict)
- Tailwind CSS v4 + semantic design tokens
- Jotai — UI filter state and live outcome prices
- TanStack React Query + `@tanstack/react-query-persist-client` — events cached in memory and IndexedDB
- `@polymarket/real-time-data-client` — live trade WebSocket for outcome prices
- Zod — API response validation
- Recharts — event detail price chart
- Lucide React — icons
- Vitest + React Testing Library

## Architecture

Structural event data and live prices are intentionally split:

- **React Query** fetches aggregated events (trending + crypto + sports + politics) via
  `/api/events`, persisted to **IndexedDB** on the client and cached in **Redis** (or in-memory
  fallback) on the server. Bump `QUERY_PERSIST_BUSTER` in `src/lib/cache/constants.ts` when the
  `Event` shape changes. Prices are read once at seed time — never written back into the query cache
  on tick.
- **Jotai** holds `selectedCategoryAtom` and `outcomePriceAtomFamily` keyed by
  `${marketId}:${outcomeId}` so each outcome updates independently.
- **Live prices** (`useLivePrices`) seed atoms from API snapshots, then subscribe to Polymarket
  `activity` trades via `@polymarket/real-time-data-client`, with simulation fallback in `auto`
  mode when the socket is unavailable.

```text
                    ┌─────────────────────┐
                    │   Gamma REST API    │
                    └──────────┬──────────┘
                               │ aggregated fetch (4 parallel)
                               ▼
                    ┌─────────────────────┐
                    │ /api/events         │
                    │ Redis + memory TTL  │
                    └──────────┬──────────┘
                               │ React Query persist (IndexedDB)
                               ▼
                    ┌─────────────────────┐
                    │   React Query       │
                    │ events · event/slug │
                    └──────────┬──────────┘
                               │ normalized Event[]
           ┌───────────────────┼───────────────────┐
           ▼                   ▼                   ▼
    useFilteredEvents     useEvent(slug)     (no price writes)
           │                   │
           ▼                   ▼
      EventsGrid         EventDetailPage
           │                   │
           └─────────┬─────────┘
                     │ useLivePrices(seeds)
                     ▼ WebSocket trades + optional simulation
           ┌─────────────────────┐
           │ Jotai price atoms   │
           │ per outcome key     │
           └──────────┬──────────┘
                      │ useAtomValue (leaves only)
                      ▼
              PriceDisplay · ProbabilityBar · YesNoChip
```

**Card routing:** a single market with exactly two outcomes → `BinaryCard`; otherwise →
`MultiOutcomeCard`. Mapping runs in memoized `EventCard` via `mapEventToCardProps`.

**Event detail:** cache-first — warm navigations resolve from the open-events query; cold direct
URLs fetch by slug.

## Routing

| Route           | Description                                                           |
| --------------- | --------------------------------------------------------------------- |
| `/`             | Home — featured carousel, category nav, responsive events grid        |
| `/crypto`       | Crypto markets — tag-specific fetch via `/api/events?tag=crypto`      |
| `/sports`       | Sports markets — tag-specific fetch via `/api/events?tag=sports`      |
| `/politics`     | Politics markets — tag-specific fetch via `/api/events?tag=politics` |
| `/event/[slug]` | Event detail — header, CLOB chart, outcome rows, order ticket UI      |
| `/api-docs`     | Interactive Swagger UI — OpenAPI explorer for REST routes           |

Category nav uses Next.js links with URL-based active state. Home (`/`) still shows aggregated
trending + category data; dedicated routes fetch per-tag lists from Gamma.

## Realtime approach

- **Primary source:** `@polymarket/real-time-data-client` WebSocket — subscribes to `activity`
  `trades` / `orders_matched` filtered by visible `event_slug`, maps `asset` (CLOB token id) to
  Jotai outcome atoms.
- **Fallback:** Client-side random-walk simulation when `NEXT_PUBLIC_LIVE_PRICE_MODE=auto` and the
  socket is not connected within 2s (or always when mode is `simulation`).
- **State:** Jotai `outcomePriceAtomFamily`; React Query holds structural event data only.
- **Updates:** Batched via `requestAnimationFrame` coalescing; only leaf components subscribe.
- **UX:** Green/red flash ~700ms on direction change; probability bars animate over 300ms;
  `prefers-reduced-motion` disables flash (see `useReducedMotion`).

## Chart data

Historical chart lines use the **Polymarket CLOB** `/prices-history` endpoint via
`/api/prices/[tokenId]` (server-cached ~45s). When CLOB data is unavailable or empty, the chart
falls back to simulated history from `lib/chart/generateChartData.ts`. The latest point is always
synced to live Jotai price atoms.

## Chrome & UX

- **Search:** Debounced client filter (300ms) with `/` keyboard shortcut to focus the input.
- **Auth:** Visual-only Log In / Sign Up modals (no real authentication).
- **Mobile nav:** Slide-in drawer with category links and auth actions.
- **Bookmarks:** Persisted to `localStorage` via `bookmarksAtom`.
- **Share / Embed:** Web Share API with clipboard fallback; embed code popover on event detail.
- **Dark mode:** Toggle in top bar; persisted theme with pre-hydration script to avoid flash.
- **Motion:** Card hover lift, route progress bar, page fade, modal/drawer transitions; respects
  `prefers-reduced-motion`.

## Limitations

- **Prices:** Live via Polymarket activity WebSocket when connected; simulation fills gaps in `auto`
  mode. Not a full CLOB order-book feed.
- **Chart:** CLOB history may be sparse or rate-limited; simulated fallback keeps UX intact.
- **Trading:** Order ticket is visual-only — "Sign up to trade" CTA is disabled.
- **Scope:** No wallet, real authentication, portfolio, or order execution.
- **Search:** Client-side filter on cached events only (no Gamma `/public-search`).

## API documentation

Interactive **Swagger UI** is available at [`/api-docs`](http://localhost:3000/api-docs) when the
dev server is running. Uses OpenAPI 3.0 + `swagger-ui-dist` (compatible with Next.js Turbopack).

| Endpoint | Description |
| -------- | ----------- |
| `GET /api/openapi` | OpenAPI 3.0 JSON specification |
| `GET /api/events` | List open events (`?tag=crypto\|sports\|politics` optional) |
| `GET /api/events/{slug}` | Single event by slug |
| `GET /api/prices/{tokenId}` | CLOB price history (`?timeframe=1d` optional) |

## Performance

- `outcomePriceAtomFamily` — one atom per outcome, not a monolithic price map.
- `React.memo` on cards, outcome rows, and category nav; `EventCard` memoizes mapped props.
- `useAtomValue` only in price leaf components — card shells do not re-render on tick.
- React Query: `refetchOnWindowFocus: false` to avoid grid flicker; category filter is client-side.
- Virtualization skipped at assignment scale (see [docs/PERFORMANCE.md](docs/PERFORMANCE.md)).

Profiler expectation: with 20+ cards visible, a single tick re-renders only the matching price
leaves, not the full grid.

## Testing

```bash
bun run test
```

Coverage includes:

- Gamma fetch/normalize, CLOB chart normalizer, per-tag server cache, card mapping, category filters
- Hooks: `useEvents`, `useFilteredEvents`, `useCategoryEvents`, `useEvent`, `useLivePrices`,
  `usePriceFlash`, `useReducedMotion`, `useChartTimeframe`
- Component tests: `EventsGrid`, `CategoryNav`, `CategoryPageView`, `FeaturedCarousel`, `OrderTicket`,
  `EventListEmpty`
- Atoms: bookmarks, category route validation

Shared test helpers: `src/test/test-utils.tsx` (`renderHookWithProviders`, `renderWithProviders`).

## Project structure

```text
src/
├── app/              Routes, layout, providers
├── components/       UI by feature (see src/components/README.md)
├── hooks/            Data + realtime hooks (see src/hooks/README.md)
├── lib/              API, atoms, prices, chart, formatters
└── types/            Polymarket domain types
```

## Implementation progress

| Phase               | Status   | Deliverable                                   |
| ------------------- | -------- | --------------------------------------------- |
| 0 — Foundation      | Complete | Tokens, providers, Gamma API, types           |
| 1 — App shell       | Complete | TopBar, CategoryNav, category filter          |
| 2 — Events grid     | Complete | BinaryCard, MultiOutcomeCard, responsive grid |
| 3 — Event detail    | Complete | `/event/[slug]`, chart, outcome rows          |
| 4 — Realtime        | Complete | Live simulation, flash, leaf-only updates     |
| 5 — Polish & README | Complete | UX audit, performance docs, submission README |

## Planning

Detailed implementation plans live in `../plans/`:

- [PLAN-Phase-0-Foundation.md](../plans/PLAN-Phase-0-Foundation.md)
- [PLAN-Phase-1-App-Shell-Category-Nav.md](../plans/PLAN-Phase-1-App-Shell-Category-Nav.md)
- [PLAN-Phase-2-Events-Grid.md](../plans/PLAN-Phase-2-Events-Grid.md)
- [PLAN-Phase-3-Event-Detail.md](../plans/PLAN-Phase-3-Event-Detail.md)
- [PLAN-Phase-4-Realtime-Prices.md](../plans/PLAN-Phase-4-Realtime-Prices.md)
- [PLAN-Phase-5-Polish-Performance-README.md](../plans/PLAN-Phase-5-Polish-Performance-README.md)

## Further reading

- [src/components/README.md](src/components/README.md) — component map and conventions
- [src/hooks/README.md](src/hooks/README.md) — hook reference and data flow
- [docs/PERFORMANCE.md](docs/PERFORMANCE.md) — profiling notes and virtualization decision
