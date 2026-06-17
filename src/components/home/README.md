# Home components

Client-heavy home page UI — featured carousel, sidebar, and the trending markets grid.

## Orchestration

| Component | Role |
| --------- | ---- |
| `EventsGrid` | Thin wrapper → `HomeMarketsView` |
| `HomeMarketsView` | Topic rails, filter controls, featured section, `MarketsPageBody` |
| `HomeFeaturedSection` | Desktop two-column row (carousel + sidebar); mobile carousel |
| `MarketsPageBody` | Shared grid body (also used outside home when needed) |

## Featured carousel

| Component | Role |
| --------- | ---- |
| `FeaturedCarousel` | Hero carousel — `layout="standalone"` (mobile) or `"sidebar"` (desktop column) |
| `FeaturedCarouselControls` | Bottom bar — pagination dots (left), prev/next pills (right, `lg+`) |
| `FeaturedEventPreview` | Polymarket-style featured card — outcomes, bid rail, chart, activity |
| `FeaturedOutcomeRows` | Outcome list inside the featured card |
| `FeaturedBidRail` | Vertical trade notionals between outcomes and chart (`lg+`) |
| `FeaturedCompactChart` | ResizeObserver + Recharts multi-line chart with live prices |
| `FeaturedActivityRail` | News-first activity feed with trade fallback |

## Right sidebar (desktop `lg+`)

| Component | Role |
| --------- | ---- |
| `HomeFeaturedSidebar` | Combo promo + hot topics + “Explore all” |
| `WorldCupComboCard` | “Build a World Cup combo” promotional card |
| `HomeHotTopicsPanel` | Ranked hot topics list (`lib/constants/hotTopics.ts`) |

## Grid states

| Component | Role |
| --------- | ---- |
| `EventsGridView` | Legacy/presentational grid wrapper |
| `EventsGridSkeleton` | Loading skeleton (optional featured strip) |
| `EventsGridError` | Retry UI |
| `EventListEmpty` | Empty search/filter copy |

## Data flow

```text
HomeMarketsView
  useFilteredEvents() → topic/sort/status/bookmark filters
  useLivePrices(featuredSeeds)
  HomeFeaturedSection → FeaturedCarousel + HomeFeaturedSidebar
  MarketsPageBody → EventCard grid + show more
```

## Tests

| File | Scope |
| ---- | ----- |
| `FeaturedCarousel.test.tsx` | Carousel render, navigation, dots |
| `FeaturedCarouselControls.test.tsx` | Dots + adjacent-market nav buttons |
| `HomeFeaturedSidebar.test.tsx` | Combo card, hot topics, explore link |
| `EventsGrid.test.tsx` | Loading, error, empty, success |
| `EventListEmpty.test.tsx` | Empty copy |

```bash
bun run test src/components/home
```
