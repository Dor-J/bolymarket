# bolymarket

bolymarket is a Next.js App Router implementation of the PLAEE frontend assignment. The goal is to
replicate the core Polymarket experience with high UI fidelity, responsive layouts, live price
updates, and clean state management.

## Repository layout

This app is the git repository. It lives inside the broader `BoliMarket/` workspace, which also
contains `design-system/` and `plans/` reference material at the workspace root.

```text
BoliMarket/           # workspace root
├── design-system/
├── plans/
└── bolymarket/       # this repo — run all commands here
```

## Stack

- Next.js 16
- TypeScript
- Tailwind CSS v4
- Jotai for UI and realtime price state
- TanStack React Query for API data caching
- Zod for API validation
- Lucide React for icons
- Motion for subtle UI animation

## Development

From `bolymarket/`:

```bash
bun install
bun run dev
```

Open `http://localhost:3000`.

## Quality commands

```bash
bun run lint
bun run build
bun run format:check
```

## Planning

Implementation starts with Phase 0: foundation setup before product UI.

See `../plans/PLAN-Phase-0-Foundation.md` for the detailed foundation plan covering tokens, Inter
font setup, Tailwind theme mapping, providers, the Gamma API layer, normalized types, atoms, and
exit criteria.

## Assignment scope

The app will focus on:

- Events grid matching the Polymarket homepage layout
- Category navigation with client-side filtering
- Event detail page with markets, prices, and probability bars
- Live price updates through WebSocket or convincing simulation
- Loading, empty, and error states
- Performance-conscious state boundaries using React Query and Jotai

Trading, wallet connection, auth, portfolio features, and order execution are intentionally out of
scope for this assignment.
