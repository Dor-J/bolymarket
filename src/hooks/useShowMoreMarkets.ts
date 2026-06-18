'use client';

import { useCallback, useState } from 'react';
import {
  INITIAL_MARKETS_DESKTOP,
  INITIAL_MARKETS_MOBILE,
  MARKETS_PAGE_SIZE,
} from '@/lib/markets/constants';

function getIsMobile(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(max-width: 767px)').matches;
}

function getInitialCount(isMobile: boolean): number {
  return isMobile ? INITIAL_MARKETS_MOBILE : INITIAL_MARKETS_DESKTOP;
}

/**
 * Manages visible market count with responsive initial size and show-more increments.
 */
export function useShowMoreMarkets(totalCount: number) {
  const isMobile = getIsMobile();
  const initialCount = getInitialCount(isMobile);

  const [state, setState] = useState({
    totalCount,
    isMobile,
    visibleCount: initialCount,
  });

  if (state.totalCount !== totalCount || state.isMobile !== isMobile) {
    setState({
      totalCount,
      isMobile,
      visibleCount: getInitialCount(isMobile),
    });
  }

  const showMore = useCallback(() => {
    setState((current) => ({
      ...current,
      visibleCount: current.visibleCount + MARKETS_PAGE_SIZE,
    }));
  }, [setState]);

  const hasMore = state.visibleCount < totalCount;

  return {
    visibleCount: state.visibleCount,
    showMore,
    hasMore,
  };
}
