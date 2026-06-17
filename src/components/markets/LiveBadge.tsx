'use client';

import { cn } from '@/lib/cn';

export interface LiveBadgeProps {
  className?: string;
}

/**
 * Compact live status badge for time-sensitive markets.
 */
export function LiveBadge({ className }: LiveBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded px-1.5 py-0.5',
        'text-[11px] leading-4 font-semibold tracking-wide text-[#e23939] uppercase',
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#e23939]" aria-hidden />
      Live
    </span>
  );
}
