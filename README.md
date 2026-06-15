# bolymarket

bolymarket is a Next.js App Router implementation of the PLAEE frontend assignment. The goal is to
replicate the core Polymarket experience with high UI fidelity, responsive layouts, live price
updates, and clean state management.

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

- Next.js 16
- TypeScript
- Tailwind CSS v4
- Jotai for UI and realtime price state
- TanStack React Query for API data caching
- Zod for API validation
- Lucide React for icons
- Motion for subtle UI animation
- Vitest + React Testing Library (hook and lib unit tests)
- Recharts (from Phase 3 onward — event detail chart)

## Development

From `bolymarket/`:

```bash
bun install
bun run dev
```

Open `http://localhost:3000`.

## Quality commands

```bash
bun run lint
bun run test          # unit tests (Vitest)
bun run test:watch    # watch mode
bun run build
bun run format:check
```

## Implementation progress

| Phase            | Status   | Deliverable                                   |
| ---------------- | -------- | --------------------------------------------- |
| 0 — Foundation   | Complete | Tokens, providers, Gamma API, types           |
| 1 — App shell    | Complete | TopBar, CategoryNav, category filter          |
| 2 — Events grid  | Complete | BinaryCard, MultiOutcomeCard, responsive grid |
| 3 — Event detail | Complete | `/event/[slug]`, chart, outcome rows          |
| 4 — Realtime     | Complete | Live simulation, flash, leaf-only updates     |

## Architecture (overview)

```text
Gamma API → React Query cache → normalized Event / Market / Outcome types
                                      ↓
              useFilteredEvents + selectedCategoryAtom → EventsGrid
                                      ↓
              useEvent(slug) → EventDetailPage
                                      ↓
              outcomePriceAtomFamily → PriceDisplay / ProbabilityBar / YesNoChip
```

- **Structural data** lives in React Query (events list, single event by slug).
- **Live prices** live in Jotai `outcomePriceAtomFamily` — one atom per `${marketId}:${outcomeId}`.
- **UI filter state** (`selectedCategoryAtom`) lives in Jotai.
- **Card variant:** single market with 2 outcomes → `BinaryCard`; otherwise → `MultiOutcomeCard`.

## Routing

| Route           | Description                                          |
| --------------- | ---------------------------------------------------- |
| `/`             | Home — events grid with category navigation          |
| `/event/[slug]` | Event detail — header, chart, outcome list, order sidebar placeholder |

Event detail uses a **cache-first** strategy: resolve from the open-events query when warm; fall
back to Gamma API fetch by slug on direct URL visits.

## Chart data

Historical chart lines use **simulated data** from `lib/chart/generateChartData.ts`, seeded from
current outcome prices. This is sufficient for the assignment — prioritize accurate **current**
prices over historical accuracy.

## Realtime approach

- **Source:** Client-side random-walk simulation (±0.5–2% per tick, clamped 0.01–0.99), seeded from
  Gamma API prices on mount — not Polymarket CLOB WebSocket data.
- **State:** Jotai `outcomePriceAtomFamily` keyed by `${marketId}:${outcomeId}`; React Query holds
  structural event data only.
- **Updates:** Batched via `requestAnimationFrame` coalescing; only leaf components
  (`PriceDisplay`, `ProbabilityBar`, `YesNoChip`) subscribe via `useAtomValue`.
- **UX:** Green/red flash ~700ms on direction change; probability bars animate width over 300ms;
  `prefers-reduced-motion` disables flash animations.

## Trading

Order sidebar on the detail page is a **static/disabled placeholder**. Wallet connection, auth,
portfolio, and order execution are out of scope.

## Planning

Detailed implementation plans live in `../plans/`:

- [PLAN-Phase-0-Foundation.md](../plans/PLAN-Phase-0-Foundation.md)
- [PLAN-Phase-1-App-Shell-Category-Nav.md](../plans/PLAN-Phase-1-App-Shell-Category-Nav.md)
- [PLAN-Phase-2-Events-Grid.md](../plans/PLAN-Phase-2-Events-Grid.md)
- [PLAN-Phase-3-Event-Detail.md](../plans/PLAN-Phase-3-Event-Detail.md)
- [PLAN-Phase-4-Realtime-Prices.md](../plans/PLAN-Phase-4-Realtime-Prices.md)

## Assignment scope

The app will focus on:

- Events grid matching the Polymarket homepage layout
- Category navigation with client-side filtering
- Event detail page with markets, prices, and probability bars
- Live price updates through WebSocket or convincing simulation
- Loading, empty, and error states
- Performance-conscious state boundaries using React Query and Jotai
- Unit tests for public library functions and critical UI behavior

Trading, wallet connection, auth, portfolio features, and order execution are intentionally out of
scope for this assignment.

## Further reading

- Component directory map: [src/components/README.md](src/components/README.md)
- Hooks reference: [src/hooks/README.md](src/hooks/README.md)
