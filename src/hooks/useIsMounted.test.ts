import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useIsMounted } from './useIsMounted';

describe('useIsMounted', () => {
  it('returns false on the initial render', () => {
    const { result } = renderHook(() => useIsMounted());

    expect(result.current).toBe(false);
  });

  it('returns true after the component mounts', async () => {
    const { result } = renderHook(() => useIsMounted());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});
