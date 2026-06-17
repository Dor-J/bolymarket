import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useIsMounted } from './useIsMounted';

describe('useIsMounted', () => {
  it('returns true after the mount effect runs', async () => {
    const { result } = renderHook(() => useIsMounted());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('stays true across rerenders', async () => {
    const { result, rerender } = renderHook(() => useIsMounted());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    rerender();

    expect(result.current).toBe(true);
  });
});
