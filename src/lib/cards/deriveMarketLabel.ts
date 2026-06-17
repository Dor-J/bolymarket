const TRAILING_TIME_PATTERN =
  /\s+(?:by|before|after|on|in|during|through|at|for)\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|\d|election day|the end|end of|q[1-4]|[a-z]+day)\b.*$/i;

function cleanLabel(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/[?.!]+$/g, '')
    .replace(/^["'“”‘’]+|["'“”‘’]+$/g, '')
    .replace(/^(?:the|a|an)\s+/i, '')
    .replace(TRAILING_TIME_PATTERN, '')
    .trim();
}

function stripQuestionWrapper(question: string): string {
  return cleanLabel(
    question
      .replace(/^(?:will|can|could|does|do|did|is|are|was|were)\s+/i, '')
      .replace(/\?$/g, ''),
  );
}

function firstMatch(question: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = question.match(pattern);
    const value = match?.[1];

    if (value) {
      return cleanLabel(value);
    }
  }

  return null;
}

/**
 * Extracts the compact answer label Polymarket shows for binary submarkets on cards.
 */
export function deriveBinaryMarketLabel(question: string): string {
  const normalized = question.trim();

  const actionObject = firstMatch(normalized, [
    /^will\s+.+?\s+agree to\s+(.+?)(?:\s+by\b|\s+before\b|\s+after\b|\s+on\b|\s+in\b|\?|$)/i,
    /^will\s+.+?\s+(?:approve|allow|ban|block|delay|cancel|announce|release|unfreeze|recognize|sanction)\s+(.+?)(?:\s+by\b|\s+before\b|\s+after\b|\s+on\b|\s+in\b|\?|$)/i,
  ]);

  if (actionObject) {
    return actionObject.replace(/^Iranian Oil Sanction Relief$/i, 'Oil Sanction Relief');
  }

  const subject = firstMatch(normalized, [
    /^will\s+(.+?)\s+win(?:\s+the\b|\s+a\b|\s+an\b|\s+by\b|\s+in\b|\s+on\b|\?|$)/i,
    /^will\s+(.+?)\s+be(?:\s+the\b|\s+a\b|\s+an\b|\s+by\b|\s+in\b|\s+on\b|\?|$)/i,
    /^will\s+(.+?)\s+become(?:\s+the\b|\s+a\b|\s+an\b|\s+by\b|\s+in\b|\s+on\b|\?|$)/i,
    /^will\s+(.+?)\s+(?:lead|receive|get|earn|resign|drop out|withdraw|qualify|advance)(?:\s+by\b|\s+in\b|\s+on\b|\?|$)/i,
  ]);

  if (subject) {
    return subject;
  }

  const existence = firstMatch(normalized, [
    /^will\s+there\s+be\s+(.+?)(?:\s+by\b|\s+before\b|\s+after\b|\s+on\b|\s+in\b|\?|$)/i,
  ]);

  if (existence) {
    return existence;
  }

  const fallback = stripQuestionWrapper(normalized);
  return fallback || normalized;
}
