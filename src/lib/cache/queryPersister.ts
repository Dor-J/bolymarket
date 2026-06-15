import type {
  PersistedClient,
  Persister,
} from '@tanstack/react-query-persist-client';
import { del, get, set } from 'idb-keyval';

/**
 * Creates an IndexedDB persister for TanStack Query via idb-keyval.
 */
export function createQueryPersister(storageKey: string): Persister {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(storageKey, client);
    },
    restoreClient: async () => {
      return await get<PersistedClient>(storageKey);
    },
    removeClient: async () => {
      await del(storageKey);
    },
  };
}
