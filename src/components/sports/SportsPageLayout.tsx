import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface SportsPageLayoutProps {
  sidebar?: ReactNode;
  children: ReactNode;
  tradePanel?: ReactNode;
  className?: string;
}

/**
 * Three-column sports shell — sidebar, live markets, and sticky trade widget.
 */
export function SportsPageLayout({
  sidebar,
  children,
  tradePanel,
  className,
}: SportsPageLayoutProps) {
  return (
    <div
      className={cn(
        'relative mx-auto flex w-full max-w-[1350px] flex-1 flex-col',
        'pb-[calc(1.5rem+var(--mobile-bottom-nav-height,56px))] lg:box-border lg:px-6 lg:pb-0',
        className,
      )}
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:flex-row lg:gap-2">
        {sidebar}
        <div className="relative h-full min-w-0 w-full flex-1">{children}</div>
        {tradePanel}
      </div>
    </div>
  );
}
