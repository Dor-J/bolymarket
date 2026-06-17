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
    <div className={cn('flex w-full justify-center py-4', className)}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'inline-flex h-10 w-fit cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full',
          'border border-border bg-surface px-4 text-sm leading-5 font-semibold text-text',
          'transition duration-150 active:scale-[97%] hover:bg-neutral-25',
          'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
        )}
      >
        Show more markets
      </button>
    </div>
  );
}
