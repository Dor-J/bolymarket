'use client';

import { cn } from '@/lib/cn';

export interface ShowMoreMarketsButtonProps {
  onClick: () => void;
  className?: string;
}

/**
 * Centered "Show more markets" button matching Polymarket style.
 */
export function ShowMoreMarketsButton({
  onClick,
  className,
}: ShowMoreMarketsButtonProps) {
  return (
    <div className={cn('flex justify-center pt-4 pb-2', className)}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'rounded-md border border-border bg-surface px-4 py-2',
          'text-sm leading-5 font-medium text-text',
          'transition-colors hover:bg-surface-2',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        )}
      >
        Show more markets
      </button>
    </div>
  );
}
