# Components

UI components for bolymarket. All paths are relative to `src/components/`.

## Directory map

```text
components/
├── api-docs/    Swagger UI client wrapper
├── cards/       Market cards for the home grid
├── category/    Dedicated category route pages (Crypto, Sports, Politics)
├── chart/       Price chart + timeframe controls
├── event/       Event detail page sections
├── home/        Home page content (grid, carousel, skeletons, empty states)
├── icons/       Inline SVG icons (nav, footer, user menu)
├── layout/      App shell — header, nav, footer, mobile chrome
├── market/      Shared market UI — prices, chips, probability bars
├── navigation/  Route progress indicator
├── theme/       Theme sync (data-theme on <html>)
└── ui/          Generic primitives — Button, Modal, BookmarkButton
```

## Layout chrome (`layout/`)

Mounted by `AppShell` on all routes except `/api-docs`.

| Component            | Type         | Notes                                                                 |
| -------------------- | ------------ | --------------------------------------------------------------------- |
| `AppShell`           | Client       | Chrome wrapper — TopBar, nav, toolbar, main, footer, mobile chrome    |
| `TopBar`             | Client       | Sticky header — logo, search (`xl+`), auth, `UserMenu` (`xl+`)        |
| `CategoryNav`        | Client, memo | Sticky 48px category rail with scroll + `CategoryNavMore`           |
| `CategoryNavLink`    | Client       | Single nav item; active = darker text only (no underline)           |
| `CategoryNavMore`    | Client       | "More" dropdown; panel portaled to avoid overflow clip                |
| `CategoryPathSync`   | Client       | Syncs `selectedCategoryAtom` from pathname                            |
| `MarketSearchToolbar`| Client       | Below-nav search + filter/bookmark icons (`xl:hidden`)              |
| `UserMenu`           | Client       | Desktop hamburger — theme, language, APIs link (`xl+`)                |
| `Footer`             | Server       | Polymarket-style responsive footer grid + legal region                |
| `MobileBottomNav`    | Client       | Fixed bottom nav — Home, Search, Breaking, More (`md:hidden`)         |
| `BackToTopButton`    | Client       | Mobile scroll-to-top pill above bottom nav (`md:hidden`)              |
| `PageContainer`      | Client       | max-w 1350px, px-6 gutters, route fade transition                     |
| `Logo`               | Server       | bolymarket wordmark                                                   |
| `ThemeToggle`        | Client       | Standalone theme toggle (used inside `UserMenu`)                      |

## Home (`home/`)

| Component            | Notes                                                       |
| -------------------- | ----------------------------------------------------------- |
| `EventsGrid`         | Home orchestrator — featured carousel + grid                |
| `EventsGridView`     | Presentational grid with loading/error/empty + live prices  |
| `FeaturedCarousel`   | Horizontal featured markets strip                           |
| `EventsGridSkeleton` | Skeleton grid matching card silhouette                      |
| `EventsGridError`    | Retry UI when events query fails                            |
| `EventListEmpty`     | Empty filter/search state                                   |

## Category pages (`category/`)

| Component          | Notes                                                        |
| ------------------ | ------------------------------------------------------------ |
| `CategoryPageView` | `/crypto`, `/sports`, `/politics` — tag fetch + grid + header |

## Cards (`cards/`)

| Component          | Notes                                                 |
| ------------------ | ----------------------------------------------------- |
| `BinaryCard`       | `React.memo` — single market, Yes/No, probability bar |
| `MultiOutcomeCard` | `React.memo` — top 2 outcomes + Yes/No chips        |
| `EventCard`        | Variant router: binary vs multi-outcome               |
| `CardSkeleton`     | Shimmer placeholder matching card anatomy             |

## Market primitives (`market/`)

| Component         | Notes                                        |
| ----------------- | -------------------------------------------- |
| `PriceDisplay`    | Leaf — outcome-scoped atom + flash animation |
| `YesNoChip`       | Green/red chip; derives No from Yes atom     |
| `ProbabilityBar`  | Live width from Yes outcome atom             |
| `MarketThumbnail` | Circular image + initial fallback            |

## Chart (`chart/`)

| Component         | Notes                                              |
| ----------------- | -------------------------------------------------- |
| `PriceChart`      | Recharts line chart; CLOB history + sim fallback   |
| `TimeframeToggle` | 1H 6H 1D 1W 1M ALL                                 |

## Event detail (`event/`)

| Component              | Notes                                      |
| ---------------------- | ------------------------------------------ |
| `EventDetailPage`      | Client orchestrator                        |
| `EventHeader`          | Breadcrumb, title, share/embed/bookmark    |
| `OutcomeLegend`        | Colored dots + live %                      |
| `OutcomeList`          | Full outcome list                          |
| `OutcomeRow`           | `React.memo` — bar + visual Buy buttons    |
| `ChartMetaRow`         | Volume + end date                          |
| `OrderTicket`          | Visual-only buy/sell panel (sticky sidebar)|
| `OrderSidebarPlaceholder` | Legacy static panel (unused in page flow) |
| `EventDetailSkeleton`  | Detail page loading state                  |
| `EventDetailError`     | Retry + back link on fetch failure         |

## UI primitives (`ui/`)

| Component        | Notes                                              |
| ---------------- | -------------------------------------------------- |
| `Button`         | ghost-brand, brand variants                        |
| `IconButton`     | Accessible icon-only control                       |
| `Chip`           | Shared Yes/No chip styling                         |
| `BookmarkButton` | Toggle bookmark via `bookmarksAtom` (localStorage) |
| `Modal`          | Auth + How it works modals                         |

## Icons (`icons/`)

| File                    | Purpose                              |
| ----------------------- | ------------------------------------ |
| `CategoryNavIcons`      | Trending flame, World Cup ball       |
| `CategoryMoreMenuIcons` | More dropdown row icons              |
| `UserMenuIcons`         | Hamburger menu row icons             |
| `FooterIcons`           | Social, mobile nav, back-to-top SVGs |
| `NavChevronDown`        | Shared chevron                       |

## Client vs server map

| Area | `'use client'` | Notes |
| ---- | -------------- | ----- |
| `layout/AppShell`, `TopBar`, `CategoryNav*`, `MarketSearchToolbar`, `UserMenu`, `MobileBottomNav`, `BackToTopButton`, `PageContainer` | Yes | Chrome + pathname / Jotai / motion |
| `layout/Footer`, `layout/Logo` | No | Static server markup |
| `home/EventsGrid`, `EventsGridView`, `EventsGridError`, `FeaturedCarousel` | Yes | Query + live prices |
| `home/EventsGridSkeleton`, `EventListEmpty` | No | Static presentational |
| `category/CategoryPageView` | Yes | Tag query + search filter |
| `cards/*`, `market/*` | Yes | Links + Jotai leaf subscriptions |
| `event/EventDetailPage` | Yes | Detail orchestrator |
| `chart/*` | Yes | Recharts + timeframe state |

## Memoized list items

`BinaryCard`, `MultiOutcomeCard`, `EventCard` (with memoized mapping), `OutcomeRow`, `CategoryNav`.

Price subscriptions stay in **leaf** market components — never on card or row shells.

## Shared layout constants

`EVENTS_GRID_CLASSES` in `lib/constants/eventsGrid.ts` keeps skeleton and live grid column classes
identical (no layout shift on hydrate).

Footer and mobile nav height: `MOBILE_BOTTOM_NAV_HEIGHT_PX` in `lib/constants/footer.ts`.

## Conventions

- Use `cn()` from `@/lib/cn` for conditional Tailwind classes.
- Consume semantic CSS tokens — avoid hard-coded hex except where design doc specifies exact values.
- `'use client'` only when the component uses hooks, browser APIs, or event handlers.
- Memoize list items (`BinaryCard`, `MultiOutcomeCard`, `OutcomeRow`) — prices subscribe in leaf
  components (`PriceDisplay`), not card roots.
- Card shell = `<Link>`; nested chips = `<button>` + `stopPropagation`.

## Tests

Component tests colocate with source (`*.test.tsx`). Key suites:

| Test file | Scope |
| --------- | ----- |
| `layout/Footer.test.tsx` | Footer content, topic grid, legal row |
| `layout/MobileBottomNav.test.tsx` | Mobile nav items, search focus |
| `layout/BackToTopButton.test.tsx` | Scroll-to-top behavior |
| `layout/MarketSearchToolbar.test.tsx` | Toolbar search, shortcut scope |
| `layout/CategoryNav.test.tsx` | Nav items, active state |
| `layout/CategoryNavMore.test.tsx` | More dropdown |
| `home/EventsGrid.test.tsx` | Loading, error, empty, success |
| `home/FeaturedCarousel.test.tsx` | Carousel render |
| `home/EventListEmpty.test.tsx` | Empty copy |
| `category/CategoryPageView.test.tsx` | Category page grid |
| `event/OrderTicket.test.tsx` | Visual order ticket |

```bash
bun run test
```

Use `renderWithProviders()` from `src/test/test-utils.tsx` for components that need React Query
and/or Jotai.
