const ELLIPSIS_PATTERN = /(?:\.\.\.|…)/;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeSpaces(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function cleanReplacement(value: string): string {
  return normalizeSpaces(value)
    .replace(/^[\s:;,\-–—]+/g, '')
    .replace(/[\s?.!]+$/g, '')
    .trim();
}

function buildLooseLiteralPattern(value: string): string {
  return escapeRegExp(normalizeSpaces(value)).replace(/\\ /g, '\\s+');
}

/**
 * Extracts the answer segment that fills an event title ellipsis.
 *
 * Example:
 * event title: "Netanyahu out by...?"
 * market question: "Netanyahu out by end of 2026?"
 * result: "end of 2026"
 */
export function deriveEllipsisOutcomeDisplayName({
  eventTitle,
  marketQuestion,
}: {
  eventTitle: string;
  marketQuestion: string;
}): string | null {
  if (!ELLIPSIS_PATTERN.test(eventTitle)) {
    return null;
  }

  const [rawPrefix = '', rawSuffix = ''] = eventTitle.split(ELLIPSIS_PATTERN);
  const prefix = normalizeSpaces(rawPrefix);
  const suffix = normalizeSpaces(rawSuffix);

  if (!prefix) {
    return null;
  }

  const prefixPattern = buildLooseLiteralPattern(prefix);
  const suffixWithoutQuestion = cleanReplacement(suffix);
  const suffixPattern = suffixWithoutQuestion
    ? `${buildLooseLiteralPattern(suffixWithoutQuestion)}\\??`
    : '\\??';
  const pattern = new RegExp(`^\\s*${prefixPattern}\\s+(.+?)\\s*${suffixPattern}\\s*$`, 'i');
  const match = marketQuestion.match(pattern);
  const replacement = match?.[1];

  if (!replacement) {
    return null;
  }

  const cleaned = cleanReplacement(replacement);
  return cleaned || null;
}

/**
 * Returns the preferred label for a binary submarket inside an event.
 */
export function deriveOutcomeDisplayName({
  eventTitle,
  marketQuestion,
  fallback,
}: {
  eventTitle: string;
  marketQuestion: string;
  fallback: string;
}): string {
  return (
    deriveEllipsisOutcomeDisplayName({ eventTitle, marketQuestion }) ??
    cleanReplacement(fallback)
  );
}
