const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};

/**
 * Formats an ISO date string for detail meta rows (e.g. "Jul 20, 2026").
 */
export function formatDate(iso?: string): string {
  if (!iso) {
    return '—';
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString('en-US', DATE_FORMAT);
}
