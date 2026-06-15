<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# bolymarket agent notes

PLAEE Polymarket-style assignment — **Phases 0–5 complete**. Stack: Next.js 16, TypeScript,
Tailwind v4, Jotai (UI + live prices), React Query (Gamma API cache), Recharts, Vitest.

Key boundaries: structural data in React Query; live prices in `outcomePriceAtomFamily` (leaf-only
`useAtomValue` in `market/` components). See [README.md](README.md) and
[docs/PERFORMANCE.md](docs/PERFORMANCE.md).
