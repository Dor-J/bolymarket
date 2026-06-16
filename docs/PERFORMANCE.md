# Performance notes

This document records performance decisions for bolymarket (PLAEE assignment). It complements the
**Performance** section in the root [README](../README.md).

## State boundaries

| Layer             | Holds                                                 | Does not hold |
| ----------------- | ----------------------------------------------------- | ------------- |
| React Query       | Events list, per-tag events, single event by slug      | Live prices   |
| Jotai             | Category filter, search query, bookmarks, theme, `outcomePriceAtomFamily` per outcome | API cache |
| Local React state | Chart timeframe, modal open state, order ticket UI    | —             |

Price ticks never call `invalidateQueries` or `setQueryData` on event queries.

## Leaf-only subscriptions

`useAtomValue(outcomePriceAtomFamily(key))` appears only in:

- `components/market/PriceDisplay.tsx`
- `components/market/ProbabilityBar.tsx`
- `components/market/YesNoChip.tsx` (derives No from Yes atom)

Card shells (`BinaryCard`, `MultiOutcomeCard`, `EventCard`) and list rows (`OutcomeRow`) do not
subscribe to price atoms. A single price tick re-renders only the affected leaf components.

## Memoization

| Component                                                     | Pattern                                                       |
| ------------------------------------------------------------- | ------------------------------------------------------------- |
| `BinaryCard`, `MultiOutcomeCard`, `OutcomeRow`, `CategoryNav` | `React.memo`                                                  |
| `EventCard`                                                   | `React.memo` + `useMemo` for `mapEventToCardProps`            |
| `EventsGrid`, `EventsGridView`, `CategoryPageView`            | `useMemo` for visible outcome seeds passed to `useLivePrices` |

## React Query policy

Configured in `app/providers.tsx`:

| Option                 | Value   | Rationale                                     |
| ---------------------- | ------- | --------------------------------------------- |
| `staleTime`            | 60s     | Avoid redundant Gamma fetches during browsing |
| `gcTime`               | 5m      | Keep warm cache for back navigation           |
| `refetchOnWindowFocus` | `false` | Prevent grid flicker on tab focus             |

Category changes on home filter cached events client-side — no network request. Dedicated category
routes (`/crypto`, etc.) use separate per-tag query keys and fetch once per tag while cache is warm.

## Live price engine

`useLivePrices` does not start a new interval or WebSocket per component instance. Instead:

1. `acquireLivePriceEngine` in `livePriceEngineManager` reference-counts subscribers.
2. One shared engine (`websocketEngine` and/or `simulationEngine` via `priceSourceFactory`) serves
   all visible outcome keys.
3. Tick commits go through `commitOutcomePriceTick` with RAF coalescing (`coalesceTicks`) so
   multiple callbacks in one frame produce one Jotai write batch.

## Simulation batching

When simulation is active, random-walk ticks are coalesced with `requestAnimationFrame` so multiple
interval callbacks in one frame produce one Jotai write batch.

## Virtualization

**Decision: skip** `@tanstack/react-virtual` for the assignment.

- Typical open-events payload is well under 100 cards.
- Scroll and tick updates remain smooth on a mid-tier laptop without virtualizing.
- Memoized cards + leaf subscriptions already limit render work per tick.

Revisit virtualization only if profiling shows sustained scroll jank (FPS &lt; 30) with a larger
dataset.

## Manual verification checklist

1. **Profiler:** Home grid with 20+ cards → one price tick → only matching `PriceDisplay` / bar /
   chip leaves re-render (card shells stay idle).
2. **Network:** Switch category tabs on home → no new Gamma requests while aggregated cache is fresh.
3. **Network:** Navigate to `/crypto` → one tag fetch; return to home → no refetch if staleTime not exceeded.
4. **Soak:** Leave tab open 5+ minutes → engine cleans up on unmount; no runaway memory growth in
   DevTools heap snapshot (smoke test).

## Images

Remote market icons use `next/image` via `MarketThumbnail` with explicit dimensions (24px cards,
32px detail rows, 48px header) to avoid layout shift. Allowed domains are listed in `next.config.ts`.
