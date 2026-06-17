'use client';

import type { MarketStatus } from '@/lib/markets/types';
import { MarketFilterDropdown } from './MarketFilterDropdown';

export interface MarketStatusSelectProps {
  value: MarketStatus;
  onChange: (value: MarketStatus) => void;
  className?: string;
}

/**
 * Separate All / Active pill dropdowns matching Polymarket controls.
 */
export function MarketStatusSelect({
  value,
  onChange,
  className,
}: MarketStatusSelectProps) {
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <MarketFilterDropdown
          label="All"
          value={value}
          options={[{ value: 'all', label: 'All' }]}
          onChange={onChange}
          menuLabel="Market scope"
        />
        <MarketFilterDropdown
          label="Active"
          value={value}
          options={[{ value: 'active', label: 'Active' }]}
          onChange={onChange}
          menuLabel="Market status"
        />
      </div>
    </div>
  );
}
