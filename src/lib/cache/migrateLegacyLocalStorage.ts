const LEGACY_EVENTS_KEY = 'bolymarket.events.v1';
const LEGACY_EVENT_PREFIX = 'bolymarket.event.';

/**
 * Removes hand-rolled localStorage cache keys from pre-IndexedDB versions.
 * Safe to call on every mount — no-op when keys are absent.
 */
export function migrateLegacyLocalStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.removeItem(LEGACY_EVENTS_KEY);

    const keysToRemove: string[] = [];
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key?.startsWith(LEGACY_EVENT_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    for (const key of keysToRemove) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Ignore quota or access errors during migration.
  }
}
