'use client';

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Provider as JotaiProvider } from 'jotai';
import { useEffect, useState, type ReactNode } from 'react';
import { ThemeSync } from '@/components/theme/ThemeSync';
import {
  QUERY_PERSIST_BUSTER,
  QUERY_PERSIST_KEY,
  QUERY_PERSIST_MAX_AGE_MS,
} from '@/lib/cache/constants';
import { migrateLegacyLocalStorage } from '@/lib/cache/migrateLegacyLocalStorage';
import { shouldPersistQuery } from '@/lib/cache/persistableQueries';
import { createQueryPersister } from '@/lib/cache/queryPersister';
import { createQueryClient } from '@/lib/query/createQueryClient';

interface ProvidersProps {
  children: ReactNode;
}

const queryPersister = createQueryPersister(QUERY_PERSIST_KEY);

/**
 * Root client providers for React Query (with IndexedDB persist) and Jotai.
 */
export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => createQueryClient());

  useEffect(() => {
    migrateLegacyLocalStorage();
  }, []);

  return (
    <JotaiProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: queryPersister,
          maxAge: QUERY_PERSIST_MAX_AGE_MS,
          buster: QUERY_PERSIST_BUSTER,
          dehydrateOptions: {
            shouldDehydrateQuery: shouldPersistQuery,
          },
        }}
      >
        <ThemeSync />
        {children}
      </PersistQueryClientProvider>
    </JotaiProvider>
  );
}
