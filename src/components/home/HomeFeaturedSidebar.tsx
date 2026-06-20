import Link from 'next/link';
import { HomeHotTopicsPanel } from './HomeHotTopicsPanel';
import { WorldCupComboCard } from './WorldCupComboCard';
import { cn } from '@/lib/cn';

export interface HomeFeaturedSidebarProps {
  className?: string;
}

/**
 * Desktop home sidebar with World Cup combo promo and hot topics.
 */
export function HomeFeaturedSidebar({ className }: HomeFeaturedSidebarProps) {
  return (
    <div
      className={cn(
        'relative hidden min-h-full w-[40%] flex-col justify-between gap-0 pb-0 lg:flex',
        className,
      )}
    >
      <WorldCupComboCard />

      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="flex max-h-[500px] min-h-[120px] flex-1 flex-col gap-4 overflow-auto pb-4">
          <HomeHotTopicsPanel />
        </div>
        <div className="shrink-0" aria-hidden />
        <div
          className={cn(
            'pointer-events-none absolute right-0 bottom-0 left-0 h-16',
            'bg-linear-to-b from-transparent to-background opacity-0 transition-opacity duration-200',
          )}
          aria-hidden
        />
      </div>

      <Link
        href="/predictions"
        className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
      >
        <span
          className={cn(
            'inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2',
            'rounded-full border border-border px-8 text-base font-semibold whitespace-nowrap',
            'text-text transition duration-150 active:scale-[97%]',
            'hover:bg-surface-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none',
          )}
          tabIndex={-1}
        >
          Explore all
        </span>
      </Link>
    </div>
  );
}
