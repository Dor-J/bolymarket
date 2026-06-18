import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Centered page container for primary app routes.
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1350px] px-6 py-6',
        'pb-[calc(1.5rem+var(--mobile-bottom-nav-height,56px))] md:pb-6',
        className,
      )}
    >
      {children}
    </div>
  );
}
