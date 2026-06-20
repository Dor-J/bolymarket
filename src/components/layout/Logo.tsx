import Link from 'next/link';
import { cn } from '@/lib/cn';

export interface LogoProps {
  className?: string;
  /** `footer` matches Polymarket 180×33 lockup proportions. */
  variant?: 'default' | 'footer';
}

/**
 * Polymarket-style geometric mark + Bolymarket wordmark.
 */
export function Logo({ className, variant = 'default' }: LogoProps) {
  const isFooter = variant === 'footer';

  return (
    <Link
      href="/"
      className={cn(
        isFooter
          ? 'block h-[33px] w-[180px]'
          : 'inline-flex h-[26px] min-w-[161px] items-center gap-2',
        'text-text',
        className,
      )}
    >
      <span
        className={cn(
          'inline-flex items-center gap-2',
          isFooter ? 'h-[33px] text-[22px] leading-[33px] font-bold tracking-tight' : '',
          !isFooter && 'text-[20px] leading-[26px] font-bold tracking-tight',
        )}
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className={cn('shrink-0', isFooter ? 'h-8 w-8' : 'h-7 w-7')}
          fill="none"
        >
          <path
            d="M6 4h7.5a4 4 0 013.5 4c0 1.43-0.7 2.47-1.83 3A4.5 4.5 0 0120 16c0 2.45-2.13 4-5.5 4H6V4zm4 6.5V6.5h3.1c1.23 0 2 .62 2 1.75 0 1.07-.77 1.75-2 1.75H10zm0 6.5v-4.5h3.77c1.31 0 2.23.7 2.23 2.25 0 1.54-.92 2.25-2.23 2.25H10z"
            fill="currentColor"
          />
        </svg>
        <span>Bolymarket</span>
      </span>
    </Link>
  );
}
