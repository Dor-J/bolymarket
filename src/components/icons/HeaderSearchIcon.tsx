import { cn } from '@/lib/cn';

export interface HeaderSearchIconProps {
  className?: string;
}

/**
 * Polymarket header search magnifier icon (18×18).
 */
export function HeaderSearchIcon({ className }: HeaderSearchIconProps) {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      className={cn('h-[18px] w-[18px]', className)}
      fill="none"
    >
      <path
        d="M15.75 15.75L11.6386 11.6386"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.75 13.25C10.7875 13.25 13.25 10.7875 13.25 7.75C13.25 4.7125 10.7875 2.25 7.75 2.25C4.7125 2.25 2.25 4.7125 2.25 7.75C2.25 10.7875 4.7125 13.25 7.75 13.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
