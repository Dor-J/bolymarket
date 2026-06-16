import Link from 'next/link';
import { cn } from '@/lib/cn';

export interface LogoProps {
  className?: string;
}

/**
 * Polymarket-style geometric mark + bolymarket wordmark.
 */
export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        'inline-flex h-[26px] min-w-[161px] items-center gap-2',
        'text-[15px] leading-[26px] font-bold tracking-tight text-text',
        className,
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="h-6 w-6 shrink-0"
        fill="none"
      >
        <path
          d="M4.5 18.5 9 4.5h4.5L18 18.5H13.5L12 13.5 10.5 18.5H4.5z"
          fill="#18181b"
        />
        <path
          d="M11 4.5 15.5 18.5H21L16.5 4.5H11z"
          fill="#18181b"
          opacity="0.72"
        />
      </svg>
      <span>bolymarket</span>
    </Link>
  );
}
