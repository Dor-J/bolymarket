import type { SportsGame } from '@/types/polymarket';

const LEAGUE_PRIORITY = [
  'mlb',
  'nba',
  'nhl',
  'nfl',
  'atp',
  'wta',
  'world-cup',
  'soccer',
  'other',
];

function getLeaguePriority(leagueId: string): number {
  const index = LEAGUE_PRIORITY.indexOf(leagueId);
  return index === -1 ? LEAGUE_PRIORITY.length : index;
}

function isGameLive(game: SportsGame): boolean {
  const status =
    game.moneyline?.gameStatus ??
    game.spread?.gameStatus ??
    game.total?.gameStatus;

  return Boolean(status && /inprogress|running|live/i.test(status));
}

function getStartTime(game: SportsGame): number {
  if (!game.gameStartTime) {
    return Number.POSITIVE_INFINITY;
  }

  const parsed = new Date(game.gameStartTime).getTime();
  return Number.isFinite(parsed) ? parsed : Number.POSITIVE_INFINITY;
}

/**
 * Sorts live sports games by league priority, live status, start time, then volume.
 */
export function sortSportsLiveGames(games: SportsGame[]): SportsGame[] {
  return games.slice().sort((left, right) => {
    const liveDelta = Number(isGameLive(right)) - Number(isGameLive(left));
    if (liveDelta !== 0) {
      return liveDelta;
    }

    const leagueDelta =
      getLeaguePriority(left.leagueId) - getLeaguePriority(right.leagueId);
    if (leagueDelta !== 0) {
      return leagueDelta;
    }

    const startDelta = getStartTime(left) - getStartTime(right);
    if (startDelta !== 0) {
      return startDelta;
    }

    return right.volume - left.volume;
  });
}
