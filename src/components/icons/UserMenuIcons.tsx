import { cn } from '@/lib/cn';

export interface UserMenuIconProps {
  className?: string;
}

/** Gold trophy icon for Leaderboard menu item. */
export function LeaderboardMenuIcon({ className }: UserMenuIconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className={cn('h-5 w-5 shrink-0', className)}
      fill="none"
    >
      <path
        d="M6.5 3h7v3.5c0 2.2-1.6 4-3.5 4s-3.5-1.8-3.5-4V3z"
        fill="#f5c451"
        stroke="#c9972c"
        strokeWidth="0.75"
      />
      <path
        d="M4 4H2.5v1.5c0 1.4 1 2.5 2.3 2.5H4M16 4h1.5v1.5c0 1.4-1 2.5-2.3 2.5H16"
        stroke="#c9972c"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M8 14.5h4M10 10.5v4M7.5 17h5"
        stroke="#c9972c"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Green rewards icon for Rewards menu item. */
export function RewardsMenuIcon({ className }: UserMenuIconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className={cn('h-5 w-5 shrink-0', className)}
      fill="none"
    >
      <circle cx="10" cy="10" r="8" fill="#30a159" />
      <path
        d="M10 6.5v7M7.5 9h5M7.5 11.5h5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Pink APIs icon for APIs menu item. */
export function ApisMenuIcon({ className }: UserMenuIconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className={cn('h-5 w-5 shrink-0', className)}
      fill="none"
    >
      <rect x="3" y="3" width="6.5" height="6.5" rx="1.5" fill="#e879f9" />
      <rect x="10.5" y="3" width="6.5" height="6.5" rx="1.5" fill="#f472b6" />
      <rect x="3" y="10.5" width="6.5" height="6.5" rx="1.5" fill="#c084fc" />
      <rect x="10.5" y="10.5" width="6.5" height="6.5" rx="1.5" fill="#fb7185" />
    </svg>
  );
}

/** Blue moon icon for Dark mode menu item. */
export function DarkModeMenuIcon({ className }: UserMenuIconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className={cn('h-5 w-5 shrink-0', className)}
      fill="none"
    >
      <path
        d="M14.8 12.2a6.2 6.2 0 0 1-7-7 6.5 6.5 0 1 0 7 7z"
        fill="#7d9ff6"
        stroke="#1452f0"
        strokeWidth="0.75"
      />
    </svg>
  );
}

/** US flag icon for Language menu item. */
export function LanguageMenuIcon({ className }: UserMenuIconProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex h-5 w-5 shrink-0 items-center justify-center text-sm leading-none',
        className,
      )}
    >
      🇺🇸
    </span>
  );
}
