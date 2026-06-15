"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";

export interface EventDetailErrorProps {
  message?: string;
  onRetry?: () => void;
}

/**
 * Error state for the event detail page.
 */
export function EventDetailError({ message, onRetry }: EventDetailErrorProps) {
  const queryClient = useQueryClient();

  return (
    <div className="rounded-card border border-border bg-card p-6 text-center">
      <p className="text-sm leading-5 text-text">
        {message ?? "Failed to load event."}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="brand"
          onClick={() => {
            void queryClient.invalidateQueries({ queryKey: ["event"] });
            onRetry?.();
          }}
        >
          Retry
        </Button>
        <Link
          href="/"
          className="text-sm font-semibold text-brand hover:underline"
        >
          Back to markets
        </Link>
      </div>
    </div>
  );
}
