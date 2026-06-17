const LEAGUE_DEFAULT_COLORS: Record<string, [string, string]> = {
  mlb: ['#C00040', '#554B4D'],
  nfl: ['#00457B', '#8B4513'],
  nba: ['#FA4E00', '#552583'],
  nhl: ['#15803d', '#C00040'],
  atp: ['#9ACD32', '#1E40AF'],
  wta: ['#E10600', '#7C3AED'],
  soccer: ['#16a34a', '#1E40AF'],
  default: ['#C00040', '#554B4D'],
};

/**
 * Returns team brand colors for odds buttons by league and team index.
 */
export function getTeamColors(
  leagueId: string,
  teamIndex: number,
): string {
  const pair = LEAGUE_DEFAULT_COLORS[leagueId] ?? LEAGUE_DEFAULT_COLORS.default!;
  return pair[teamIndex % pair.length]!;
}

/**
 * Applies an optional team-specific override color.
 */
export function resolveTeamColor(
  leagueId: string,
  teamIndex: number,
  teamColor?: string,
): string {
  return teamColor ?? getTeamColors(leagueId, teamIndex);
}
