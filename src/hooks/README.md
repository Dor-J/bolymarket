# Hooks

Custom React hooks for bolymarket. All paths are relative to `src/hooks/`.

## Hook reference

| Hook | Phase | Purpose |
| --- | --- | --- |
| `useEvents` | 1 | React Query wrapper — fetches open events via `eventsQueryOptions` |
| `useFilteredEvents` | 1 | Reads `selectedCategoryAtom`; filters + sorts cached events by volume |
| `useEvent` | 3 | React Query wrapper — single event by slug, cache-first |
| `useChartTimeframe` | 3 | Local state for chart timeframe toggle (`1h` … `all`) |
| `useLivePrices` | 4 (stub) | Subscribe to live price updates for visible market IDs |
| `usePriceFlash` | 4 (stub) | Flash styling on price direction change |

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

Hook tests use `@testing-library/react` with a test wrapper:

```tsx
function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <Provider>{children}</Provider>
      </QueryClientProvider>
    );
  };
}
```

See `../../plans/PLAN-Phase-2-Events-Grid.md` and `../../plans/PLAN-Phase-3-Event-Detail.md` for
required test coverage per phase.
