import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface CategoryPageLayoutProps {
  sidebar?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Two-column category shell — sticky sidebar on lg+ with a flexible main column.
 */
export function CategoryPageLayout({
  sidebar,
  children,
  className,
}: CategoryPageLayoutProps) {
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-[1320px] flex-col pt-2',
        'pb-[calc(1.5rem+var(--mobile-bottom-nav-height,56px))] lg:pb-0',
        'lg:flex-row lg:justify-center lg:gap-8 lg:px-3',
        className,
      )}
    >
      {sidebar}
      <div className="min-h-[calc(100vh-8rem)] w-full min-w-0 flex-1">{children}</div>
    </div>
  );
}
