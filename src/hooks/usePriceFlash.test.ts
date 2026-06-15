import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { usePriceFlash } from './usePriceFlash';

vi.mock('./useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

describe('usePriceFlash', () => {
  it('returns up flash when price increases', () => {
    const { result } = renderHook(() => usePriceFlash(0.62, 0.6, Date.now()));

    expect(result.current.direction).toBe('up');
    expect(result.current.flashClassName).toBe('price-flash-up');
  });

  it('returns down flash when price decreases', () => {
    const { result } = renderHook(() => usePriceFlash(0.58, 0.6, Date.now()));

    expect(result.current.direction).toBe('down');
    expect(result.current.flashClassName).toBe('price-flash-down');
  });

  it('returns neutral when values are equal', () => {
    const { result } = renderHook(() => usePriceFlash(0.6, 0.6, Date.now()));

    expect(result.current).toEqual({
      direction: 'none',
      flashClassName: '',
    });
  });

  it('returns neutral when updatedAt is missing', () => {
    const { result } = renderHook(() => usePriceFlash(0.7, 0.5, undefined));

    expect(result.current.direction).toBe('none');
  });
});
