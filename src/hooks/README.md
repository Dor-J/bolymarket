# Hooks

Custom React hooks for bolymarket. All paths are relative to `src/hooks/`.

## Hook reference

| Hook                | Phase    | Purpose                                                               |
| ------------------- | -------- | --------------------------------------------------------------------- |
| `useEvents`         | 1        | React Query wrapper — fetches open events via `eventsQueryOptions`    |
| `useFilteredEvents` | 1        | Reads `selectedCategoryAtom`; filters + sorts cached events by volume |
| `useEvent`          | 3        | React Query wrapper — single event by slug, cache-first               |
| `useChartTimeframe` | 3        | Local state for chart timeframe toggle (`1h` … `all`)                 |
| `useLivePrices`     | 4 (stub) | Subscribe to live price updates for visible market IDs                |
| `usePriceFlash`     | 4 (stub) | Flash styling on price direction change                               |

## Data flow

### Home page (Phase 1–2)

```text
useEvents()                    → React Query: ['events', { closed: false }]
        ↓
useFilteredEvents()            → useAtomValue(selectedCategoryAtom)
        ↓                        filterAndSortEvents() in useMemo
EventsGrid / EventsGrid        → renders EventCard list
```

Category changes are **instant** — no refetch; filter runs on cached data only.

### Event detail (Phase 3)

```text
useEvent(slug)                 → React Query: ['event', slug]
        ↓                        cache-first from events list, else fetchEventBySlug
EventDetailPage                → header, chart, outcome rows
```

Direct URL visits (`/event/my-slug`) hit the API when the events cache is cold.

### Realtime (Phase 4)

```text
useLivePrices(marketIds)       → seeds + ticks marketPriceAtomFamily
        ↓
PriceDisplay                   → useAtomValue per market/outcome — leaf re-render only
```

## Conventions

- Data fetching hooks use TanStack React Query — never Jotai for API cache.
- UI filter and live price state use Jotai atoms from `@/lib/atoms/`.
- Hooks that call `useQuery` must be used inside `QueryClientProvider` (wired in `app/providers.tsx`).
- Export JSDoc on every public hook describing params, return shape, and phase status.

## Tests

Hook tests colocate with source files and use the shared wrapper in
[`src/test/test-utils.tsx`](../test/test-utils.tsx):

| Test file                   | Hook / scope                                                    |
| --------------------------- | --------------------------------------------------------------- |
| `useEvents.test.ts`         | Loading, success, error, query key                              |
| `useFilteredEvents.test.ts` | Category filter, volume sort, error forwarding, category change |
| `useEvent.test.ts`          | Cache-first slug lookup; cold-cache API fallback                 |
| `useLivePrices.test.ts`     | Stub contract (Phase 4 `describe.todo` for live subscription)   |
| `usePriceFlash.test.ts`     | Stub contract (Phase 4 `describe.todo` for flash styling)       |

Related pure-function tests:

| Test file | Scope |
| --- | --- |
| `src/lib/filters/category.test.ts` | Category filter + sort |
| `src/lib/format/price.test.ts` | Percent and cents formatting |
| `src/lib/format/volume.test.ts` | Volume abbreviations |
| `src/lib/cards/resolveCardVariant.test.ts` | Binary vs multi-outcome routing |
| `src/lib/cards/mapEventToCardProps.test.ts` | Event → card prop mapping |
| `src/lib/format/date.test.ts` | ISO date formatting |
| `src/lib/chart/generateChartData.test.ts` | Simulated chart series |
| `src/lib/event/formatBreadcrumb.test.ts` | Detail breadcrumb labels |
| `src/lib/event/flattenOutcomes.test.ts` | Detail outcome row flattening |
| `src/lib/api/gamma.test.ts` | `fetchEventBySlug` happy path + errors |

Mock event fixtures: [`src/test/fixtures/events.ts`](../test/fixtures/events.ts)

```bash
bun run test          # run once
bun run test:watch    # watch mode
```

Use `renderHookWithProviders()` from `src/test/test-utils.tsx` for hooks that need React Query
and/or Jotai. Pass `queryClient`, `jotaiStore`, and call `seedEventsQuery()` to preload the events
cache without hitting the Gamma API.
