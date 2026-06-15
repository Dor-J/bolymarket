# Components

UI components for bolymarket. All paths are relative to `src/components/`.

## Directory map

```text
components/
├── cards/       Market cards for the home grid (Phase 2)
├── chart/       Price chart + timeframe controls (Phase 3)
├── event/       Event detail page sections (Phase 3)
├── home/        Home page content (grid, skeletons, empty states)
├── layout/      App shell — TopBar, CategoryNav, PageContainer
├── market/      Shared market UI — prices, chips, probability bars
├── navigation/  Route progress indicator
├── theme/       Theme sync (data-theme on <html>)
└── ui/          Generic primitives — Button, IconButton, Chip
```

## Phase status by folder

### `layout/` — Phase 1 (complete)

| Component       | Type         | Notes                                    |
| --------------- | ------------ | ---------------------------------------- |
| `AppShell`      | Server       | TopBar + CategoryNav wrapper             |
| `TopBar`        | Client       | Sticky 64px — logo, search, auth buttons |
| `CategoryNav`   | Client, memo | Sticky 48px — Jotai category filter      |
| `PageContainer` | Server       | max-w 1350px, px-6 gutters               |
| `Logo`          | Server       | bolymarket wordmark                      |

### `home/` — Phase 2 (complete)

| Component            | Notes                                            |
| -------------------- | ------------------------------------------------ |
| `EventsGrid`         | Responsive card grid container                   |
| `EventsGridSkeleton` | Skeleton grid matching card silhouette           |
| `EventsGridError`    | Retry UI when events query fails                 |
| `EventListEmpty`     | Empty category filter state                      |

### `cards/` — Phase 2 (complete)

| Component          | Notes                                                 |
| ------------------ | ----------------------------------------------------- |
| `BinaryCard`       | `React.memo` — single market, Yes/No, probability bar |
| `MultiOutcomeCard` | `React.memo` — top 2 outcomes + chips                 |
| `EventCard`        | Variant router: binary vs multi-outcome               |
| `CardSkeleton`     | Shimmer placeholder matching card anatomy             |

### `market/` — Phase 2 (complete, reused in Phase 3)

| Component         | Notes                                     |
| ----------------- | ----------------------------------------- |
| `PriceDisplay`    | Leaf — atom-ready % display; tabular nums |
| `YesNoChip`       | Green/red chip; stopPropagation on card   |
| `ProbabilityBar`  | §12.3 — animated width (Phase 4 ticks)    |
| `MarketThumbnail` | 24px circular image + initial fallback    |

### `chart/` — Phase 3

| Component         | Notes                                           |
| ----------------- | ----------------------------------------------- |
| `PriceChart`      | Client — Recharts line chart, simulated history |
| `TimeframeToggle` | Client — 1H 6H 1D 1W 1M ALL                     |

### `event/` — Phase 3

| Component                    | Notes                                 |
| ---------------------------- | ------------------------------------- |
| `EventDetailPage`            | Client orchestrator                   |
| `EventHeader`                | Icon, breadcrumb, H1, action icons    |
| `OutcomeLegend`              | Colored dots + live %                 |
| `OutcomeList` / `OutcomeRow` | `React.memo` rows — bar + Buy buttons |
| `ChartMetaRow`               | Volume + end date                     |
| `OrderSidebarPlaceholder`    | Static disabled trading panel         |
| `EventDetailSkeleton`        | Detail page loading state             |

### `ui/` — Phase 1–2

| Component        | Notes                          |
| ---------------- | ------------------------------ |
| `Button`         | ghost-brand, brand variants    |
| `IconButton`     | Accessible icon-only control   |
| `Chip`           | Shared Yes/No chip styling     |
| `BookmarkButton` | Non-functional heart on cards  |

## Conventions

- Use `cn()` from `@/lib/cn` for conditional Tailwind classes.
- Consume semantic CSS tokens — avoid hard-coded hex except where design doc specifies exact values.
- `'use client'` only when the component uses hooks, browser APIs, or event handlers.
- Memoize list items (`BinaryCard`, `MultiOutcomeCard`, `OutcomeRow`) — prices subscribe in leaf
  components (`PriceDisplay`), not card roots.
- Card shell = `<Link>`; nested chips = `<button>` + `stopPropagation`.

## Tests

Component tests live next to source files (`*.test.tsx`) or under `__tests__/`. See
`../plans/PLAN-Phase-2-Events-Grid.md` and `../plans/PLAN-Phase-3-Event-Detail.md` for required
coverage.
