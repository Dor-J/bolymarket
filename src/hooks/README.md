# Hooks

Custom React hooks for Bolymarket. All paths are relative to `src/hooks/`.

## Hook reference

| Hook                   | Purpose                                                                  |
| ---------------------- | ------------------------------------------------------------------------ |
| `useEvents`            | React Query wrapper — fetches aggregated open events                     |
| `useFilteredEvents`    | Category + debounced search filter on home aggregated cache              |
| `useCategoryEvents`    | React Query per-tag fetch for `/crypto`, `/sports`, `/politics` + search |
| `useEvent`             | React Query — single event by slug, cache-first                          |
| `useChartTimeframe`    | Local state for chart timeframe toggle (`1h` … `all`)                    |
| `useLivePrices`        | Seeds outcome atoms; shared WebSocket/simulation engine for visible keys |
| `usePriceFlash`        | Flash direction + CSS class from price delta                             |
| `useReducedMotion`     | Reads `prefers-reduced-motion` for accessible price updates              |
| `useDebouncedValue`    | Generic debounce helper (search uses 300ms)                              |
| `useSearchShortcut`    | Focuses search input on `/` key (`enabled` param for breakpoint gating)  |
| `useShowMoreMarkets`   | Paginates visible market count with responsive initial size + show more  |
| `useIsMounted`         | `true` after client mount — defers hydration-sensitive UI                |
| `useLiveChartOutcomes` | Merges Jotai live prices into chart outcome metadata (stable snapshots)  |
| `useSportsLiveGames`   | React Query — sports live games from `/api/sports/live`                  |
| `useSportsGameResults` | Subscribes ref-counted sports WebSocket for visible game ids             |
| `useSportsGameState`   | Resolves live sports row state by game id, slug, then matchup key        |

## Data flow

### Home page (`/`)

```text
useEvents()                    → React Query: aggregated ['events', { closed: false }]
        ↓
useFilteredEvents()            → selectedCategoryAtom + debounced searchQueryAtom
        ↓                        filterAndSortEvents() + filterEventsBySearch()
EventsGrid                     → FeaturedCarousel + EventsGridView
        ↓
useLivePrices(seeds)           → shared livePriceEngineManager
```

Category changes on home are **instant** when filtering cached aggregated data. Navigating to
`/politics` etc. uses a dedicated tag fetch instead.

### Category pages (`/crypto`, `/sports`, `/politics`)

```text
useCategoryEvents(tag)         → React Query: ['events', { tag }]
        ↓                        filterEventsBySearch(debounced searchQueryAtom)
CategoryPageView               → header + EventsGridView (with featured strip)
        ↓
useLivePrices(seeds)
```

`CategoryPathSync` sets `selectedCategoryAtom` from the pathname so nav active state stays correct.

### Event detail (`/event/[slug]`)

```text
useEvent(slug)                 → React Query: ['event', slug]
        ↓                        cache-first from events list, else fetchEventBySlug
EventDetailPage                → header, chart, outcome rows, order ticket
        ↓
useLivePrices(seeds)
```

Direct URL visits hit the API when the events cache is cold.

### Realtime

```text
useLivePrices(priceSeeds)
        ↓
seedOutcomePrices()            → Jotai outcomePriceAtomFamily
        ↓
acquireLivePriceEngine()       → shared manager merges active keys across callers
        ↓
websocketEngine / simulationEngine
        ↓
commitOutcomePriceTick()       → manager-owned RAF-coalesced atom writes
        ↓
PriceDisplay · ProbabilityBar · YesNoChip
```

Mode is controlled by `NEXT_PUBLIC_LIVE_PRICE_MODE` (`auto` | `websocket` | `simulation`) via
`priceSourceFactory`.

`useLivePrices()` callers hold a stable lease and update it when visible seeds change. The shared
manager owns stale atom pruning and coalesced tick flushing so one view cannot remove another
view's active price atoms or disable tick delivery while subscribers remain mounted.

### Search shortcut

`TopBar` enables `useSearchShortcut(searchRef, isXlUp)` for header search at `xl+`.
`MarketSearchToolbar` enables it when `!isXlUp`. Only one input is focused per breakpoint.

## Conventions

- Data fetching hooks use TanStack React Query — never Jotai for API cache.
- UI filter, search, bookmarks, theme, and live price state use Jotai atoms from `@/lib/atoms/`.
- Hooks that call `useQuery` must be used inside `QueryClientProvider` (wired in `app/providers.tsx`).
- Export JSDoc on every public hook describing params, return shape, and behavior.

## Tests

Hook tests colocate with source files and use the shared wrapper in
[`src/test/test-utils.tsx`](../test/test-utils.tsx):

| Test file                             | Hook / scope                                           |
| ------------------------------------- | ------------------------------------------------------ |
| `useEvents.test.ts`                   | Loading, success, error, query key                     |
| `useFilteredEvents.test.ts`           | Category filter, volume sort, search, error forwarding |
| `useEvent.test.ts`                    | Cache-first slug lookup; cold-cache API fallback       |
| `useLivePrices.test.ts`               | Seeds atoms, engine lease, cleanup                     |
| `useDebouncedValue.test.ts`           | Debounce timing                                        |
| `usePriceFlash.test.ts`               | Up/down/none flash classes                             |
| `usePriceFlash.reducedMotion.test.ts` | Reduced-motion neutral path via usePriceFlash          |
| `useChartTimeframe.test.ts`           | Initial timeframe + selectTimeframe updates            |
| `useReducedMotion.test.ts`            | matchMedia preference + change listener                |
| `useCategoryEvents.test.ts`           | Tag fetch, error forwarding, debounced search filter   |
| `useSearchShortcut.test.ts`           | `/` focus, disabled state, editable guard, cleanup     |
| `useShowMoreMarkets.test.ts`          | Initial count, show more, hasMore, totalCount reset    |
| `useIsMounted.test.ts`                | Mount detection, stable true across rerenders          |
| `useLiveChartOutcomes.test.ts`        | Live price merge, snapshot stability, atom updates     |
| `useSportsLiveGames.test.ts`          | Query options, loading, success, error                 |
| `useSportsGameResults.test.ts`        | Prune, WebSocket lease acquire/release, id changes     |
| `useSportsGameState.test.ts`          | Game id, slug, matchup fallback, missing-state null    |

Related lib tests (realtime, not hooks but coupled):

| Test file                                     | Scope                            |
| --------------------------------------------- | -------------------------------- |
| `lib/realtime/livePriceEngineManager.test.ts` | Shared engine reference counting |
| `lib/realtime/simulationEngine.test.ts`       | Simulation start/stop            |
| `lib/realtime/tradePayload.test.ts`           | WebSocket trade → price mapping  |
| `lib/realtime/subscriptionIndex.test.ts`      | Event slug subscription index    |

Component tests that exercise hooks indirectly:

| Test file                                           | Scope                                   |
| --------------------------------------------------- | --------------------------------------- |
| `src/components/home/EventsGrid.test.tsx`           | Loading skeleton, error, empty, success |
| `src/components/category/CategoryPageView.test.tsx` | Tag page data flow                      |

Mock event fixtures: [`src/test/fixtures/events.ts`](../test/fixtures/events.ts)

```bash
bun run test          # full suite
bun run test:watch    # watch mode
```

Use `renderHookWithProviders()` or `renderWithProviders()` from `src/test/test-utils.tsx` for hooks
and components that need React Query and/or Jotai. Pass `queryClient`, `jotaiStore`, and call
`seedEventsQuery()` to preload the events cache without hitting the Gamma API.
