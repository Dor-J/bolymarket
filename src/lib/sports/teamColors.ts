import type { SportsGame, SportsMarket } from '@/types/polymarket';

const PASTEL_TEAM = '#F7C7D0';
const PASTEL_NEUTRAL = '#ECECEC';
const PASTEL_NEUTRAL_TEXT = '#4B5563';

/**
 * Returns softened button colors for sports odds rows.
 */
export function getSportsButtonColors(
  leagueId: string,
  teamIndex: number,
  teamColor?: string,
): { background: string; color: string } {
  if (teamIndex === 0) {
    return {
      background: softenColor(teamColor) ?? PASTEL_TEAM,
      color: '#7A102F',
    };
  }

  return {
    background: PASTEL_NEUTRAL,
    color: PASTEL_NEUTRAL_TEXT,
  };
}

function softenColor(color?: string): string | undefined {
  if (!color) {
    return undefined;
  }

  if (color.startsWith('#') && color.length === 7) {
    const r = Number.parseInt(color.slice(1, 3), 16);
    const g = Number.parseInt(color.slice(3, 5), 16);
    const b = Number.parseInt(color.slice(5, 7), 16);
    const mix = (value: number) => Math.round(value + (255 - value) * 0.55);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
  }

  return color;
}

/**
 * Applies league defaults when no team color is available.
 */
export function resolveTeamColor(
  leagueId: string,
  teamIndex: number,
  teamColor?: string,
): string {
  return getSportsButtonColors(leagueId, teamIndex, teamColor).background;
}

/**
 * Merges spread/total markets from a sibling event into a base game card.
 */
export function mergeSportsGameCards(
  base: SportsGame,
  incoming: SportsGame,
): SportsGame {
  const merged: SportsGame = {
    ...base,
    volume: Math.max(base.volume, incoming.volume),
    spread: base.spread ?? incoming.spread,
    total: base.total ?? incoming.total,
    wsGameId: base.wsGameId ?? incoming.wsGameId,
  };

  if (!base.moneyline && incoming.moneyline) {
    merged.moneyline = incoming.moneyline;
  }

  if (incoming.isMoreMarkets) {
    merged.spread = incoming.spread ?? merged.spread;
    merged.total = incoming.total ?? merged.total;
  }

  if (!base.isMoreMarkets && incoming.isMoreMarkets) {
    merged.title = base.title;
    merged.slug = base.slug;
  }

  return merged;
}

/**
 * Returns saturated moneyline button colors for the sports feed row.
 */
export function getMoneylineFeedColors(
  teamIndex: number,
  teamColor?: string,
): { background: string; color: string } {
  const defaults = teamIndex === 0
    ? { background: '#C00040', color: '#ffffff' }
    : { background: '#554B4D', color: '#ffffff' };

  if (!teamColor) {
    return defaults;
  }

  return {
    background: teamColor,
    color: '#ffffff',
  };
}

/**
 * Picks the better primary market line when merging totals/spreads.
 */
export function pickBetterLineMarket(
  current: SportsMarket | undefined,
  candidate: SportsMarket | undefined,
): SportsMarket | undefined {
  if (!candidate) {
    return current;
  }

  if (!current) {
    return candidate;
  }

  const currentLine = current.line ?? 0;
  const candidateLine = candidate.line ?? 0;

  if (candidateLine > 1 && currentLine <= 1) {
    return candidate;
  }

  return current;
}
