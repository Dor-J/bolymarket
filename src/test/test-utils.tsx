import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createStore, Provider as JotaiProvider } from 'jotai';
import {
  render,
  renderHook,
  type RenderHookOptions,
  type RenderHookResult,
  type RenderOptions,
} from '@testing-library/react';
import type { ReactNode } from 'react';
import { selectedCategoryAtom } from '@/lib/atoms/category';
import type { CategoryFilter, Event } from '@/types/polymarket';

export const EVENTS_QUERY_KEY = ['events', { closed: false, aggregated: true }] as const;

/**
 * Creates a QueryClient tuned for deterministic hook tests.
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });
}

/**
 * Seeds the open events query cache.
 */
export function seedEventsQuery(client: QueryClient, events: Event[]): void {
  client.setQueryData(EVENTS_QUERY_KEY, events);
}

export type JotaiTestStore = ReturnType<typeof createStore>;

/**
 * Creates a Jotai store with an optional category preset.
 */
export function createJotaiStore(
  category: CategoryFilter = "trending",
): JotaiTestStore {
  const store = createStore();
  store.set(selectedCategoryAtom, category);
  return store;
}

interface ProviderWrapperOptions {
  queryClient?: QueryClient;
  jotaiStore?: JotaiTestStore;
}

function createProviderWrapper({
  queryClient = createTestQueryClient(),
  jotaiStore = createJotaiStore(),
}: ProviderWrapperOptions = {}) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <JotaiProvider store={jotaiStore}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </JotaiProvider>
    );
  };
}

interface RenderHookWithProvidersOptions<Props> extends ProviderWrapperOptions {
  initialProps?: Props;
  renderHookOptions?: Omit<RenderHookOptions<Props>, "wrapper">;
}

/**
 * Renders a hook wrapped with Jotai and React Query providers.
 */
export function renderHookWithProviders<Result, Props>(
  hook: (props: Props) => Result,
  options: RenderHookWithProvidersOptions<Props> = {},
): RenderHookResult<Result, Props> & {
  queryClient: QueryClient;
  jotaiStore: JotaiTestStore;
} {
  const queryClient = options.queryClient ?? createTestQueryClient();
  const jotaiStore = options.jotaiStore ?? createJotaiStore();

  const result = renderHook(hook, {
    ...options.renderHookOptions,
    initialProps: options.initialProps,
    wrapper: createProviderWrapper({ queryClient, jotaiStore }),
  });

  return {
    ...result,
    queryClient,
    jotaiStore,
  };
}

interface RenderWithProvidersOptions extends ProviderWrapperOptions {
  renderOptions?: Omit<RenderOptions, "wrapper">;
}

/**
 * Renders a component tree wrapped with Jotai and React Query providers.
 */
export function renderWithProviders(
  ui: ReactNode,
  options: RenderWithProvidersOptions = {},
) {
  const queryClient = options.queryClient ?? createTestQueryClient();
  const jotaiStore = options.jotaiStore ?? createJotaiStore();

  return {
    queryClient,
    jotaiStore,
    ...render(ui, {
      ...options.renderOptions,
      wrapper: createProviderWrapper({ queryClient, jotaiStore }),
    }),
  };
}
