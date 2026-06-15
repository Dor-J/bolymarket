import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useChartTimeframe } from './useChartTimeframe';

describe('useChartTimeframe', () => {
  it('defaults to the all timeframe', () => {
    const { result } = renderHook(() => useChartTimeframe());

    expect(result.current.timeframe).toBe('all');
  });

  it('accepts a custom initial timeframe', () => {
    const { result } = renderHook(() => useChartTimeframe('1d'));

    expect(result.current.timeframe).toBe('1d');
  });

  it('updates timeframe via selectTimeframe', () => {
    const { result } = renderHook(() => useChartTimeframe());

    act(() => {
      result.current.selectTimeframe('1w');
    });

    expect(result.current.timeframe).toBe('1w');
  });

  it('keeps a stable selectTimeframe callback', () => {
    const { result, rerender } = renderHook(() => useChartTimeframe());
    const firstCallback = result.current.selectTimeframe;

    rerender();

    expect(result.current.selectTimeframe).toBe(firstCallback);
  });
});
