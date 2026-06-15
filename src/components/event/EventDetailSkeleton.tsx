import { cn } from "@/lib/cn";

export interface EventDetailSkeletonProps {
  className?: string;
}

/**
 * Loading skeleton matching the event detail page layout (§14).
 */
export function EventDetailSkeleton({ className }: EventDetailSkeletonProps) {
  return (
    <div className={cn("space-y-6", className)} aria-busy="true">
      <div className="space-y-3">
        <div className="h-4 w-32 rounded-sm shimmer" />
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-full shimmer" />
          <div className="h-7 w-[70%] rounded-sm shimmer" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={`legend-${index}`}
            className="h-4 w-24 rounded-sm shimmer"
          />
        ))}
      </div>

      <div className="h-[240px] w-full rounded-card shimmer lg:h-[400px]" />

      <div className="flex gap-2">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={`toggle-${index}`}
            className="h-9 w-10 rounded-md shimmer"
          />
        ))}
      </div>

      <div className="flex justify-between">
        <div className="h-4 w-40 rounded-sm shimmer" />
        <div className="h-4 w-24 rounded-sm shimmer" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={`row-${index}`}
            className="space-y-3 border-b border-border pb-4"
          >
            <div className="flex justify-between gap-4">
              <div className="flex flex-1 items-center gap-3">
                <div className="h-8 w-8 rounded-full shimmer" />
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded-sm shimmer" />
                  <div className="h-3 w-24 rounded-sm shimmer" />
                </div>
              </div>
              <div className="h-7 w-12 rounded-sm shimmer" />
            </div>
            <div className="h-2 w-full rounded-full shimmer" />
            <div className="flex gap-2">
              <div className="h-12 flex-1 rounded-[7.2px] shimmer" />
              <div className="h-12 flex-1 rounded-[7.2px] shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
