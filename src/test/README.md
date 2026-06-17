# Test utilities

Shared Vitest + React Testing Library helpers in `test-utils.tsx` and fixtures.

## Files

| File | Purpose |
| ---- | ------- |
| `test-utils.tsx` | `renderWithProviders`, `renderHookWithProviders`, query/Jotai seeding |
| `fixtures/events.ts` | `createMockEvent`, `mockEvents` for cards and grids |
| `setup.ts` | Global test setup (if configured in `vitest.config`) |

## Provider wrapper

`renderHookWithProviders` and `renderWithProviders` wrap children with:

- `JotaiProvider` (optional custom store via `createJotaiStore()`)
- `QueryClientProvider` (optional custom client via `createTestQueryClient()`)

### Common options

```ts
renderHookWithProviders(() => useMyHook(), {
  jotaiStore: createJotaiStore(),
  queryClient: createTestQueryClient(),
});
```

### Seeding React Query

```ts
const client = createTestQueryClient();
seedEventsQuery(client, mockEvents);
renderWithProviders(<MyComponent />, { queryClient: client });
```

## Conventions

- Colocate tests as `*.test.ts` / `*.test.tsx` next to source.
- Reset singleton engines in `afterEach` when testing realtime hooks
  (`resetLivePriceEngineForTests`, `resetSportsWebSocketEngineForTests`, etc.).
- Use `vi.mock()` for API clients and WebSocket factories — never hit real Gamma/CLOB in unit tests.

## Commands

```bash
bun run test              # full suite
bun run test:watch        # watch mode
bun run test src/hooks    # hook tests only
```
