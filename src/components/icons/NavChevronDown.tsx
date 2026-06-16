import { cn } from '@/lib/cn';

export interface NavChevronDownProps {
  className?: string;
  open?: boolean;
}

/**
 * 12×12 chevron used in Polymarket category "More" trigger.
 */
export function NavChevronDown({ className, open }: NavChevronDownProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      width={12}
      height={12}
      className={cn(
        'shrink-0 transition-transform duration-200',
        open ? 'rotate-180' : '',
        className,
      )}
      fill="none"
    >
      <polyline
        points="1.75 4.25 6 8.5 10.25 4.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
