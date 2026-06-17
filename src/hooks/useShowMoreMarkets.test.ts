import { act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  INITIAL_MARKETS_DESKTOP,
  INITIAL_MARKETS_MOBILE,
  MARKETS_PAGE_SIZE,
} from '@/lib/markets/constants';
import { renderHookWithProviders } from '@/test/test-utils';
import { useShowMoreMarkets } from './useShowMoreMarkets';

function mockMatchMedia(isMobile: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: isMobile && query.includes('max-width'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

describe('useShowMoreMarkets', () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts with the desktop initial visible count', () => {
    const { result } = renderHookWithProviders(() => useShowMoreMarkets(100));

    expect(result.current.visibleCount).toBe(INITIAL_MARKETS_DESKTOP);
    expect(result.current.hasMore).toBe(true);
  });

  it('starts with the mobile initial visible count', () => {
    mockMatchMedia(true);

    const { result } = renderHookWithProviders(() => useShowMoreMarkets(100));

    expect(result.current.visibleCount).toBe(INITIAL_MARKETS_MOBILE);
    expect(result.current.hasMore).toBe(true);
  });

  it('increments visible count when showMore is called', () => {
    const { result } = renderHookWithProviders(() => useShowMoreMarkets(100));

    act(() => {
      result.current.showMore();
    });

    expect(result.current.visibleCount).toBe(
      INITIAL_MARKETS_DESKTOP + MARKETS_PAGE_SIZE,
    );
  });

  it('reports hasMore as false when all markets are visible', () => {
    const { result } = renderHookWithProviders(() => useShowMoreMarkets(10));

    expect(result.current.visibleCount).toBe(INITIAL_MARKETS_DESKTOP);
    expect(result.current.hasMore).toBe(false);
  });

  it('resets visible count when totalCount changes', () => {
    const { result, rerender } = renderHookWithProviders(
      ({ totalCount }: { totalCount: number }) => useShowMoreMarkets(totalCount),
      { initialProps: { totalCount: 100 } },
    );

    act(() => {
      result.current.showMore();
    });

    expect(result.current.visibleCount).toBe(
      INITIAL_MARKETS_DESKTOP + MARKETS_PAGE_SIZE,
    );

    rerender({ totalCount: 50 });

    expect(result.current.visibleCount).toBe(INITIAL_MARKETS_DESKTOP);
    expect(result.current.hasMore).toBe(true);
  });
});
