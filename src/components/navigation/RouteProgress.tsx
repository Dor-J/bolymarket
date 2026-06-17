"use client";

import { usePathname } from "next/navigation";

/**
 * 2px brand progress bar shown during route transitions.
 */
export function RouteProgress() {
  const pathname = usePathname();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-100 h-(--bprogress-height)"
    >
      <div key={pathname} className="route-progress-bar h-full bg-brand" />
    </div>
  );
}
