'use client';

import { Chip, type ChipVariant } from '@/components/ui/Chip';
import { PriceDisplay } from './PriceDisplay';

export interface YesNoChipProps {
  side: ChipVariant;
  price: number;
  marketId: string;
  outcomeId: string;
  fullWidth?: boolean;
  onClick?: () => void;
}

/**
 * Yes/No trading chip with live price display on the Yes outcome atom.
 */
export function YesNoChip({
  side,
  price,
  marketId,
  outcomeId,
  fullWidth = false,
  onClick,
}: YesNoChipProps) {
  const label = side === 'yes' ? 'Yes' : 'No';

  return (
    <Chip
      variant={side}
      fullWidth={fullWidth}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick?.();
      }}
    >
      {label}{' '}
      <PriceDisplay
        marketId={marketId}
        outcomeId={outcomeId}
        initialPrice={price}
        side={side}
        className="ml-0.5"
      />
    </Chip>
  );
}
