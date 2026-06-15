'use client';

import { useCallback, useState } from 'react';
import type { Timeframe } from '@/lib/chart/types';

/**
 * Local state for the event detail price chart timeframe toggle.
 */
export function useChartTimeframe(initial: Timeframe = 'all') {
  const [timeframe, setTimeframe] = useState<Timeframe>(initial);

  const selectTimeframe = useCallback((next: Timeframe) => {
    setTimeframe(next);
  }, []);

  return { timeframe, selectTimeframe };
}
