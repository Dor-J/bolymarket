import type { Query } from '@tanstack/react-query';

/**
 * Returns true when a query should be written to IndexedDB persistence.
 * Only structural event API queries are persisted — never live prices.
 */
export function shouldPersistQuery(query: Query): boolean {
  if (query.state.status !== 'success') {
    return false;
  }

  const key = query.queryKey;

  if (key[0] === 'events') {
    return true;
  }

  if (key[0] === 'event' && typeof key[1] === 'string') {
    return true;
  }

  return false;
}
