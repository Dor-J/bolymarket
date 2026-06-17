/**
 * Builds a short sports team ticker from an outcome or team label.
 */
export function getTeamAbbrev(label: string): string {
  const cleaned = label.trim();
  if (!cleaned) {
    return '—';
  }

  if (/^draw$/i.test(cleaned)) {
    return 'DRAW';
  }

  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0]!.slice(0, 3).toUpperCase();
  }

  return words
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
}
