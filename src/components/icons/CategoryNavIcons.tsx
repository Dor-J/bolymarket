import { cn } from '@/lib/cn';

export interface TrendingIconProps {
  className?: string;
}

/**
 * Polymarket-style trending chart icon for category nav.
 */
export function TrendingIcon({ className }: TrendingIconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 18 18"
      className={cn('h-[18px] w-[18px] shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 13l4-5 3 3 5-7" />
      <polyline points="12 4 17 4 17 9" />
    </svg>
  );
}

export interface WorldCupIconProps {
  className?: string;
}

/**
 * World Cup soccer ball icon for category nav.
 */
export function WorldCupIcon({ className }: WorldCupIconProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center text-base leading-none',
        className,
      )}
    >
      ⚽
    </span>
  );
}
