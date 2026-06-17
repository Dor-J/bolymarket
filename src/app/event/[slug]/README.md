# Event detail route

Route: `/event/[slug]` → `page.tsx`

## Files

| File | Role |
| ---- | ---- |
| `page.tsx` | Server entry — renders `EventDetailPage` inside `PageContainer` |
| `loading.tsx` | Route-level loading UI (`EventDetailSkeleton`) |
| `not-found.tsx` | 404 when slug does not resolve |

## Behavior

- **Warm navigation:** `useEvent(slug)` reads from the open-events React Query cache first.
- **Cold URL:** Fetches `GET /api/events/[slug]` when the slug is not cached.
- **Live prices:** `useLivePrices` seeds Jotai atoms from API snapshots, then WebSocket/simulation.
- **Chart:** CLOB history via `/api/prices/[tokenId]` with simulated fallback.

## Components

All UI lives in `components/event/` and `components/chart/`. See
[`components/event/README.md`](../../components/event/README.md).

## SEO

`generateMetadata` in `page.tsx` sets title/description from the resolved event when available.
