'use client';

import { useMemo } from 'react';
import { useReducedMotion } from './useReducedMotion';

export type PriceDirection = 'up' | 'down' | 'none';

export interface UsePriceFlashResult {
  direction: PriceDirection;
  flashClassName: string;
}

const PRICE_EPSILON = 1e-6;

/**
 * Returns flash styling when a price changes direction between ticks.
 */
export function usePriceFlash(
  current: number,
  previous: number,
  updatedAt?: number,
): UsePriceFlashResult {
  const prefersReducedMotion = useReducedMotion();

  return useMemo(() => {
    if (prefersReducedMotion || updatedAt === undefined) {
      return { direction: 'none', flashClassName: '' };
    }

    const delta = current - previous;

    if (Math.abs(delta) < PRICE_EPSILON) {
      return { direction: 'none', flashClassName: '' };
    }

    if (delta > 0) {
      return { direction: 'up', flashClassName: 'price-flash-up' };
    }

    return { direction: 'down', flashClassName: 'price-flash-down' };
  }, [current, previous, updatedAt, prefersReducedMotion]);
}
