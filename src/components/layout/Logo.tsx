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
        'text-[20px] leading-[26px] font-bold tracking-tight text-text',
        className,
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="h-7 w-7 shrink-0"
        fill="none"
      >
        {/* Bold geometric "B" in a modern/grotesk style */}
        <path
          d="M6 4h7.5a4 4 0 013.5 4c0 1.43-0.7 2.47-1.83 3A4.5 4.5 0 0120 16c0 2.45-2.13 4-5.5 4H6V4zm4 6.5V6.5h3.1c1.23 0 2 .62 2 1.75 0 1.07-.77 1.75-2 1.75H10zm0 6.5v-4.5h3.77c1.31 0 2.23.7 2.23 2.25 0 1.54-.92 2.25-2.23 2.25H10z"
          fill="#181818"
        />
        <path
          d="M13.1 8.25c0-0.44-0.33-0.75-1-0.75H10v1.5h2.1c0.67 0 1-0.31 1-0.75zM13.77 14.25c0-0.63-0.41-1-1.27-1H10v2h2.5c0.86 0 1.27-0.37 1.27-1z"
          fill="#fff"
        />
      </svg>
      <span>Bolymarket</span>
    </Link>
  );
}
