import { SearchX } from "lucide-react";
import { cn } from "@/lib/cn";

export interface EventListEmptyProps {
  className?: string;
  message?: string;
}

/**
 * Empty state when a category filter yields no markets.
 */
export function EventListEmpty({ className, message }: EventListEmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-center",
        className,
      )}
    >
      <SearchX className="h-8 w-8 text-muted" aria-hidden />
      <p className="text-sm leading-5 font-medium text-muted">
        {message ?? 'No markets found'}
      </p>
    </div>
  );
}
