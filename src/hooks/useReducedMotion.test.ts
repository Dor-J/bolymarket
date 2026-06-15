import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useReducedMotion } from './useReducedMotion';

function createMatchMedia(matches: boolean) {
  const listeners = new Set<() => void>();

  return {
    matches,
    addEventListener: (_event: string, listener: () => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_event: string, listener: () => void) => {
      listeners.delete(listener);
    },
    dispatchChange(nextMatches: boolean) {
      this.matches = nextMatches;
      for (const listener of listeners) {
        listener();
      }
    },
  };
}

describe('useReducedMotion', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns false when reduced motion is not preferred', async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue(createMatchMedia(false)),
    );

    const { result } = renderHook(() => useReducedMotion());

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('returns true when reduced motion is preferred', async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue(createMatchMedia(true)),
    );

    const { result } = renderHook(() => useReducedMotion());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('updates when the media query preference changes', async () => {
    const mediaQuery = createMatchMedia(false);
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mediaQuery));

    const { result } = renderHook(() => useReducedMotion());

    await waitFor(() => {
      expect(result.current).toBe(false);
    });

    mediaQuery.dispatchChange(true);

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});
