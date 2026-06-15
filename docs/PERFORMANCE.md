# Performance notes

This document records performance decisions for bolymarket (PLAEE assignment). It complements the
**Performance** section in the root [README](../README.md).

## State boundaries

| Layer             | Holds                                                 | Does not hold |
| ----------------- | ----------------------------------------------------- | ------------- |
| React Query       | Events list, single event by slug                     | Live prices   |
| Jotai             | Category filter, `outcomePriceAtomFamily` per outcome | API cache     |
| Local React state | Chart timeframe                                       | —             |

Price ticks never call `invalidateQueries` or `setQueryData` on event queries.

## Leaf-only subscriptions

`useAtomValue(outcomePriceAtomFamily(key))` appears only in:

- `components/market/PriceDisplay.tsx`
- `components/market/ProbabilityBar.tsx`
- `components/market/YesNoChip.tsx` (derives No from Yes atom)

Card shells (`BinaryCard`, `MultiOutcomeCard`, `EventCard`) and list rows (`OutcomeRow`) do not
subscribe to price atoms. A single simulation tick re-renders only the affected leaf components.

## Memoization

| Component                                                     | Pattern                                                       |
| ------------------------------------------------------------- | ------------------------------------------------------------- |
| `BinaryCard`, `MultiOutcomeCard`, `OutcomeRow`, `CategoryNav` | `React.memo`                                                  |
| `EventCard`                                                   | `React.memo` + `useMemo` for `mapEventToCardProps`            |
| `EventsGrid`                                                  | `useMemo` for visible outcome seeds passed to `useLivePrices` |

## React Query policy

Configured in `app/providers.tsx`:

| Option                 | Value   | Rationale                                     |
| ---------------------- | ------- | --------------------------------------------- |
| `staleTime`            | 60s     | Avoid redundant Gamma fetches during browsing |
| `gcTime`               | 5m      | Keep warm cache for back navigation           |
| `refetchOnWindowFocus` | `false` | Prevent grid flicker on tab focus             |

Category changes filter cached events client-side — no network request.

## Simulation batching

`useLivePrices` seeds atoms once per visible outcome set, then runs a random-walk simulation. Tick
commits are coalesced with `requestAnimationFrame` so multiple interval callbacks in one frame produce
one Jotai write batch.

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
2. **Network:** Switch category tabs → no new Gamma requests while cache is fresh.
3. **Soak:** Leave tab open 5+ minutes → simulation interval cleans up on unmount; no runaway memory
   growth in DevTools heap snapshot (smoke test).

## Images

Remote market icons use `next/image` via `MarketThumbnail` with explicit dimensions (24px cards,
32px detail rows, 48px header) to avoid layout shift. Allowed domains are listed in `next.config.ts`.
