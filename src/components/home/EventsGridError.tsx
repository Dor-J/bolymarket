"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";

export interface EventsGridErrorProps {
  message?: string;
  onRetry?: () => void;
}

/**
 * Error state for the home events grid.
 */
export function EventsGridError({ message, onRetry }: EventsGridErrorProps) {
  const queryClient = useQueryClient();

  return (
    <div className="rounded-card border border-border bg-card p-6 text-center">
      <p className="text-sm leading-5 text-text">
        {message ?? "Failed to load markets."}
      </p>
      <Button
        variant="brand"
        className="mt-4"
        onClick={() => {
          void queryClient.invalidateQueries({ queryKey: ["events"] });
          onRetry?.();
        }}
      >
        Retry
      </Button>
    </div>
  );
}
