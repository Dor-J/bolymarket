import { cn } from "@/lib/cn";

export interface EventListSkeletonProps {
  rows?: number;
  className?: string;
}

/**
 * Loading placeholder rows for the event list.
 */
export function EventListSkeleton({
  rows = 8,
  className,
}: EventListSkeletonProps) {
  return (
    <ul
      className={cn("flex flex-col gap-3", className)}
      aria-busy="true"
      aria-label="Loading markets"
    >
      {Array.from({ length: rows }, (_, index) => (
        <li
          key={index}
          className="rounded-card border border-border bg-card p-4"
        >
          <div className="shimmer h-4 w-[60%] rounded-sm" />
          <div className="mt-3 shimmer h-3 w-[35%] rounded-sm" />
          <div className="mt-2 shimmer h-3 w-[75%] rounded-sm" />
        </li>
      ))}
    </ul>
  );
}
