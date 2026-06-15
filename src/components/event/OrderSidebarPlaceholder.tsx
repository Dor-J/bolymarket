import { cn } from "@/lib/cn";

export interface OrderSidebarPlaceholderProps {
  className?: string;
}

/**
 * Static disabled trading sidebar placeholder (§16.5).
 */
export function OrderSidebarPlaceholder({
  className,
}: OrderSidebarPlaceholderProps) {
  return (
    <aside
      className={cn("rounded-card border border-border bg-card p-4", className)}
      aria-label="Trading panel placeholder"
    >
      <div className="flex rounded-md bg-surface-2 p-1">
        <button
          type="button"
          disabled
          className="flex-1 rounded-sm bg-card px-3 py-2 text-sm font-semibold text-text"
        >
          Buy
        </button>
        <button
          type="button"
          disabled
          className="flex-1 rounded-sm px-3 py-2 text-sm font-semibold text-muted"
        >
          Sell
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          disabled
          className="rounded-md bg-surface-2 px-3 py-2 text-sm font-semibold text-text"
        >
          Market
        </button>
        <button
          type="button"
          disabled
          className="rounded-md px-3 py-2 text-sm font-semibold text-muted"
        >
          Limit
        </button>
      </div>

      <label className="mt-4 block text-sm font-medium text-muted">
        Amount
        <input
          type="text"
          disabled
          placeholder="$0"
          className="mt-2 w-full rounded-md border border-border bg-surface-2 px-3 py-3 text-sm text-muted"
        />
      </label>

      <button
        type="button"
        disabled
        className="mt-4 w-full rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white opacity-60"
      >
        Sign up to trade
      </button>
    </aside>
  );
}
