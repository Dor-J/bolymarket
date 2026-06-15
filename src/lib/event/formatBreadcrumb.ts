import type { Event } from "@/types/polymarket";

/**
 * Capitalizes the first character of a slug or label.
 */
function capitalizeLabel(value: string): string {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Builds a breadcrumb label from category and the first tag (e.g. "Sports · Soccer").
 */
export function formatBreadcrumb(event: Event): string | null {
  const parts = [event.category, event.tags[0]]
    .filter(Boolean)
    .map((part) => capitalizeLabel(part as string));

  if (parts.length === 0) {
    return null;
  }

  return parts.join(" · ");
}
