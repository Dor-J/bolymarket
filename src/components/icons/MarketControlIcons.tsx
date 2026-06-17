import { cn } from '@/lib/cn';

export interface MarketControlIconProps {
  className?: string;
}

/** Small chevron for filter pill dropdowns. */
export function MarketFilterChevronIcon({ className }: MarketControlIconProps) {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 12 12"
      className={cn('shrink-0', className)}
    >
      <polyline
        points="1.75 4.25 6 8.5 10.25 4.25"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** Volume trend icon for sort pill. */
export function MarketVolumeTrendIcon({ className }: MarketControlIconProps) {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className={cn('h-[18px] w-[18px] shrink-0', className)}
      fill="none"
    >
      <path
        d="M1.75,12.25l3.646-3.646c.195-.195,.512-.195,.707,0l3.293,3.293c.195,.195,.512,.195,.707,0l6.146-6.146"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <polyline
        points="11.25 5.75 16.25 5.75 16.25 10.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** Sliders icon for section filter toggle. */
export function MarketSlidersIcon({ className }: MarketControlIconProps) {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-[18px] w-[18px] shrink-0', className)}
    >
      <line x1="9.25" y1="5.25" x2="16.25" y2="5.25" />
      <line x1="1.75" y1="5.25" x2="4.75" y2="5.25" />
      <line x1="8.75" y1="12.75" x2="1.75" y2="12.75" />
      <line x1="16.25" y1="12.75" x2="13.25" y2="12.75" />
      <circle cx="7" cy="5.25" r="2.25" />
      <circle cx="11" cy="12.75" r="2.25" />
    </svg>
  );
}

/** Watchlist ribbon icon for section bookmark toggle. */
export function MarketWatchlistIcon({ className }: MarketControlIconProps) {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className={cn('h-[18px] w-[18px] shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 3.75h9v12l-4.5-3-4.5 3v-12z" />
    </svg>
  );
}
