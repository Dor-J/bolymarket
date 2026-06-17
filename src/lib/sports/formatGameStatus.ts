import type { SportsGameState } from '@/types/polymarket';

const MLB_INNING_MAP: Record<string, string> = {
  '1': '1st',
  '2': '2nd',
  '3': '3rd',
};

function formatOrdinal(value: string): string {
  return MLB_INNING_MAP[value] ?? `${value}th`;
}

/**
 * Formats live game status text for display (e.g. "Top 1st", "Q4 5:18").
 */
export function formatGameStatus(
  state: SportsGameState | null | undefined,
  leagueId?: string,
): string | null {
  if (!state) {
    return null;
  }

  if (state.live && state.period) {
    const period = state.period;
    const elapsed = state.elapsed?.trim();

    if (leagueId === 'mlb' || /^top|bot|end/i.test(period)) {
      if (/^top/i.test(period)) {
        const inning = period.replace(/^top\s*/i, '').trim();
        return `Top ${formatOrdinal(inning)}`;
      }
      if (/^bot/i.test(period)) {
        const inning = period.replace(/^bot(?:tom)?\s*/i, '').trim();
        return `Bot ${formatOrdinal(inning)}`;
      }
      if (/^end/i.test(period)) {
        return period;
      }
    }

    if (/^q\d/i.test(period) && elapsed) {
      return `${period.toUpperCase()} ${elapsed}`;
    }

    if (period === 'HT') {
      return 'HT';
    }

    if (elapsed) {
      return `${period} ${elapsed}`;
    }

    return period;
  }

  if (state.status) {
    if (/inprogress|running|live/i.test(state.status)) {
      return 'Live';
    }
    if (/scheduled/i.test(state.status)) {
      return null;
    }
  }

  return state.live ? 'Live' : null;
}

/**
 * Splits a score string like "3-16" into home/away numeric scores.
 */
export function parseScorePair(
  score: string | undefined,
): [number | null, number | null] {
  if (!score) {
    return [null, null];
  }

  const parts = score.split(/[-|]/).map((part) => part.trim());
  if (parts.length < 2) {
    return [null, null];
  }

  const away = Number.parseInt(parts[0] ?? '', 10);
  const home = Number.parseInt(parts[1] ?? '', 10);

  return [
    Number.isFinite(away) ? away : null,
    Number.isFinite(home) ? home : null,
  ];
}
