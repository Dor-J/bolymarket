'use client';

import { MarketVolumeTrendIcon } from '@/components/icons/MarketControlIcons';
import type { MarketSort } from '@/lib/markets/types';
import { MarketFilterDropdown } from './MarketFilterDropdown';

export interface MarketSortSelectProps {
  value: MarketSort;
  onChange: (value: MarketSort) => void;
  className?: string;
}

const SORT_LABELS: Record<MarketSort, string> = {
  volume: '24hr Volume',
  newest: 'Newest',
};

const SORT_OPTIONS = (Object.keys(SORT_LABELS) as MarketSort[]).map((key) => ({
  value: key,
  label: SORT_LABELS[key],
}));

/**
 * Sort pill dropdown with volume trend icon (Polymarket parity).
 */
export function MarketSortSelect({ value, onChange, className }: MarketSortSelectProps) {
  return (
    <MarketFilterDropdown
      label={SORT_LABELS[value]}
      value={value}
      options={SORT_OPTIONS}
      onChange={onChange}
      leadingIcon={<MarketVolumeTrendIcon />}
      className={className}
      menuLabel="Sort markets"
    />
  );
}
