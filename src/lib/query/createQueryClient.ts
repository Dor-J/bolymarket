import { QueryClient } from '@tanstack/react-query';
import { QUERY_PERSIST_MAX_AGE_MS } from '@/lib/cache/constants';

/**
 * Shared QueryClient defaults for the app and tests.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: QUERY_PERSIST_MAX_AGE_MS,
        refetchOnWindowFocus: false,
        retry: 2,
      },
    },
  });
}
