import { useEffect, useState } from 'react';

/** Default debounce delay for search input (ms). */
export const SEARCH_DEBOUNCE_MS = 300;

/**
 * Returns a debounced copy of `value` that updates after `delayMs` of stability.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
