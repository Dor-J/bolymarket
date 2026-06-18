# Event detail components

Client orchestrator and sections for `/event/[slug]`.

## Orchestration

| Component | Role |
| --------- | ---- |
| `EventDetailPage` | Cache-first slug fetch, live prices, layout assembly |
| `EventDetailSkeleton` | Loading state |
| `EventDetailError` | Retry + back link |

## Header & context

| Component | Role |
| --------- | ---- |
| `EventHeader` | Breadcrumb, title, share/embed/bookmark actions |
| `EventMarketContext` | Volume, end date, category metadata |
| `ChartMetaRow` | Chart footer stats, timeframe tabs, and chart utility controls |

## Markets & chart

| Component | Role |
| --------- | ---- |
| `OutcomeLegend` | Colored dots + live percentages |
| `OutcomeList` | Full outcome list container |
| `OutcomeRow` | `React.memo` — Polymarket-style outcome row with volume, probability, and Buy buttons |
| `OrderTicket` | Visual-only buy/sell sidebar with selected outcome header and terms footer |
| `OrderSidebarPlaceholder` | Legacy static panel (unused in page flow) |

Chart rendering lives in `components/chart/` (`PriceChart`, `TimeframeToggle`).
`TimeframeToggle` is composed into `ChartMetaRow` on event detail pages.

## Variant routing

`lib/event/resolveEventDetailVariant.ts` picks layout variants (binary vs multi-outcome)
before rendering outcome sections.

## Data flow

```text
useEvent(slug) → React Query ['event', slug]
useLivePrices(seeds) → Jotai outcome atoms
useChartTimeframe() → local timeframe state
```

## Tests

Event detail UI is covered indirectly via hook tests (`useEvent`) and page integration.
Add colocated `*.test.tsx` here when adding new interactive event sections.
