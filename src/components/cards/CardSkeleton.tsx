import { cn } from '@/lib/cn';

export interface CardSkeletonProps {
  className?: string;
}

/**
 * Loading silhouette matching market card dimensions (§14).
 */
export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div
      className={cn(
        'flex min-h-[180px] flex-col rounded-card border border-[#e6e8ea] bg-card p-3',
        className,
      )}
      aria-hidden
    >
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 shrink-0 rounded-full shimmer" />
        <div className="h-4 w-[60%] rounded-sm shimmer" />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="h-4 w-[45%] rounded-sm shimmer" />
          <div className="h-[27px] w-16 rounded-[5.2px] shimmer" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="h-4 w-[40%] rounded-sm shimmer" />
          <div className="h-[27px] w-16 rounded-[5.2px] shimmer" />
        </div>
      </div>

      <div className="mt-auto pt-4">
        <div className="h-3 w-20 rounded-sm shimmer" />
      </div>
    </div>
  );
}
