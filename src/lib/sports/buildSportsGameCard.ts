import { SPORTS_LEAGUE_SECTIONS } from '@/lib/markets/constants';
import type {
  SportsEvent,
  SportsGame,
  SportsLeagueSummary,
  SportsMarket,
  TeamInfo,
} from '@/types/polymarket';
import { classifySportsMarkets } from './classifySportsMarkets';
import { sortSportsLiveGames } from './sortSportsLiveGames';
import { getTeamAbbrev } from './teamAbbrev';
import {
  mergeSportsGameCards,
  pickBetterLineMarket,
} from './teamColors';
import type { TeamLookup } from './teamLookup';
import { resolveTeam } from './teamLookup';
import { getSportIconUrl } from './sportIcons';

const FUTURES_PATTERN = /futures|winner|champion|season|mvp|award/i;
const PROP_SUFFIX_PATTERN =
  / - (exact score|player props|total corners|halftime result|second half result|first team to score|stage of elimination|starting 11|total cards|both teams to score|anytime scorer)/i;
const NON_MATCHUP_PATTERN =
  /where will|play in|will .* win the|top scorer|group [a-z]|stage of elimination/i;

/**
 * Normalizes a matchup title for deduplication across sibling events.
 */
export function normalizeMatchupKey(title: string): string {
  return title
    .replace(/\s*-\s*more markets$/i, '')
    .replace(/\s*-\s*.+$/i, '')
    .trim()
    .toLowerCase();
}

function isMatchupTitle(title: string): boolean {
  if (FUTURES_PATTERN.test(title) || NON_MATCHUP_PATTERN.test(title)) {
    return false;
  }

  if (PROP_SUFFIX_PATTERN.test(title)) {
    return false;
  }

  return /\bvs\.?\b/i.test(title);
}

function isFuturesTitle(title: string): boolean {
  return FUTURES_PATTERN.test(title) || NON_MATCHUP_PATTERN.test(title);
}

function eventHaystack(event: SportsEvent): string {
  return [
    event.title,
    event.category,
    event.description,
    ...event.tags,
    ...event.markets.map((market) => market.question),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

/**
 * Resolves league id/label from event tags and title keywords.
 */
export function resolveLeagueForEvent(event: SportsEvent): {
  id: string;
  label: string;
} {
  const haystack = eventHaystack(event);

  for (const section of SPORTS_LEAGUE_SECTIONS) {
    if (section.keywords.some((keyword) => haystack.includes(keyword))) {
      return { id: section.id, label: section.label };
    }
  }

  return { id: 'other', label: 'OTHER' };
}

function parseTeamsFromTitle(title: string): [string, string] | null {
  const match = title.match(/^(.+?)\s+vs\.?\s+(.+?)(?:\s*-\s*|$)/i);
  if (!match) {
    return null;
  }

  return [match[1]!.trim(), match[2]!.trim()];
}

function buildTeamFromOutcome(
  outcomeName: string,
  abbrev: string | undefined,
  teamLookup: TeamLookup,
  teamId: string | undefined,
  leagueId: string,
  index: number,
  titleFallback?: string,
): TeamInfo {
  const parsedTeams = titleFallback ? parseTeamsFromTitle(titleFallback) : null;
  const parsedName = parsedTeams?.[index];
  const isGenericOutcome = /^(yes|no|draw|over|under)$/i.test(outcomeName);
  const lookupName = isGenericOutcome ? parsedName : outcomeName;

  const fromApi = resolveTeam(teamLookup, {
    teamId,
    name: lookupName,
    abbreviation: abbrev,
  });

  const name = fromApi?.name ?? lookupName ?? outcomeName;
  const abbreviation =
    abbrev ?? fromApi?.abbreviation ?? getTeamAbbrev(name);

  return {
    id: fromApi?.id ?? index,
    name,
    abbreviation,
    record: fromApi?.record,
    logo: fromApi?.logo,
    league: fromApi?.league ?? leagueId,
    color: fromApi?.color,
    alias: fromApi?.alias,
  };
}

function getGameStartTime(markets: SportsMarket[]): string | undefined {
  return markets.find((market) => market.gameStartTime)?.gameStartTime;
}

function getGameId(event: SportsEvent, markets: SportsMarket[]): string {
  const fromMarket = markets.find((market) => market.gameId)?.gameId;
  return fromMarket ?? event.id;
}

function getDisplayTitle(title: string): string {
  return title.replace(/\s*-\s*more markets$/i, '').trim();
}

/**
 * Builds a sports game view model from a normalized sports event.
 */
export function buildSportsGameCard(
  event: SportsEvent,
  teamLookup: TeamLookup,
): SportsGame | null {
  const markets =
    event.sportsMarkets.length > 0 ? event.sportsMarkets : event.markets;
  const sportsMarkets = markets as SportsMarket[];
  const classified = classifySportsMarkets(sportsMarkets);
  const primary = classified.moneyline ?? sportsMarkets[0];

  if (!primary || primary.outcomes.length < 2) {
    return null;
  }

  const league = resolveLeagueForEvent(event);
  const shortOutcomes = primary.shortOutcomes;
  const teamAId = primary.teamAId;
  const teamBId = primary.teamBId;
  const displayTitle = getDisplayTitle(event.title);
  const isMoreMarkets = / - more markets$/i.test(event.title);

  const teams = [
    buildTeamFromOutcome(
      primary.outcomes[0]!.name,
      shortOutcomes?.[0],
      teamLookup,
      teamAId,
      league.id,
      0,
      displayTitle,
    ),
    buildTeamFromOutcome(
      primary.outcomes[1]!.name,
      shortOutcomes?.[1],
      teamLookup,
      teamBId,
      league.id,
      1,
      displayTitle,
    ),
  ] as [TeamInfo, TeamInfo];

  const gameId = getGameId(event, sportsMarkets);

  return {
    gameId,
    eventId: event.id,
    slug: event.slug,
    title: displayTitle,
    league: league.label,
    leagueId: league.id,
    volume: event.volume,
    image: event.image,
    gameStartTime: getGameStartTime(sportsMarkets),
    matchupKey: normalizeMatchupKey(displayTitle),
    wsGameId: gameId,
    isMoreMarkets,
    teams,
    moneyline: classified.moneyline,
    spread: classified.spread,
    total: classified.total,
    tags: event.tags,
  };
}

/**
 * Returns true when the game should appear on the live sports feed.
 */
export function isLiveOrUpcomingGame(game: SportsGame): boolean {
  if (!isMatchupTitle(game.title)) {
    return false;
  }

  const status =
    game.moneyline?.gameStatus ??
    game.spread?.gameStatus ??
    game.total?.gameStatus;

  if (status && /inprogress|running|live/i.test(status)) {
    return true;
  }

  if (!game.gameStartTime) {
    return game.moneyline !== undefined;
  }

  const start = new Date(game.gameStartTime).getTime();
  if (!Number.isFinite(start)) {
    return true;
  }

  const now = Date.now();
  const windowMs = 48 * 60 * 60 * 1000;
  return start >= now - windowMs && start <= now + windowMs;
}

function mergeGamePair(existing: SportsGame, incoming: SportsGame): SportsGame {
  const merged = mergeSportsGameCards(existing, incoming);

  if (!incoming.isMoreMarkets) {
    merged.spread = pickBetterLineMarket(merged.spread, incoming.spread);
    merged.total = pickBetterLineMarket(merged.total, incoming.total);
  }

  return merged;
}

function dedupeGamesByMatchup(games: SportsGame[]): SportsGame[] {
  const byKey = new Map<string, SportsGame>();

  for (const game of games) {
    const key = game.matchupKey;
    const existing = byKey.get(key);

    if (!existing) {
      byKey.set(key, game);
      continue;
    }

    byKey.set(key, mergeGamePair(existing, game));
  }

  return Array.from(byKey.values());
}

/**
 * Builds game cards from sports events, filtering to live/upcoming matchups.
 */
export function buildSportsGamesFromEvents(
  events: SportsEvent[],
  teamLookup: TeamLookup,
): SportsGame[] {
  const games: SportsGame[] = [];

  for (const event of events) {
    const game = buildSportsGameCard(event, teamLookup);
    if (game && isLiveOrUpcomingGame(game)) {
      games.push(game);
    }
  }

  return sortSportsLiveGames(dedupeGamesByMatchup(games));
}

/**
 * Builds futures-style game cards for the Futures tab.
 */
export function buildSportsFuturesFromEvents(
  events: SportsEvent[],
  teamLookup: TeamLookup,
): SportsGame[] {
  const games: SportsGame[] = [];

  for (const event of events) {
    if (!isFuturesTitle(event.title)) {
      continue;
    }

    const game = buildSportsGameCard(event, teamLookup);
    if (game) {
      games.push(game);
    }
  }

  return games.sort((left, right) => right.volume - left.volume);
}

/**
 * Groups games into league summaries for the sidebar.
 */
export function buildLeagueSummaries(
  games: SportsGame[],
  metadataIcons: Map<string, string> = new Map(),
): SportsLeagueSummary[] {
  const counts = new Map<string, { label: string; count: number }>();

  for (const game of games) {
    const existing = counts.get(game.leagueId);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(game.leagueId, { label: game.league, count: 1 });
    }
  }

  const summaries: SportsLeagueSummary[] = [];

  for (const section of SPORTS_LEAGUE_SECTIONS) {
    const entry = counts.get(section.id);
    if (entry) {
      summaries.push({
        id: section.id,
        label: section.label,
        count: entry.count,
        icon: getSportIconUrl(section.id, metadataIcons.get(section.id)),
      });
      counts.delete(section.id);
    }
  }

  for (const [id, entry] of counts) {
    summaries.push({
      id,
      label: entry.label,
      count: entry.count,
      icon: getSportIconUrl(id, metadataIcons.get(id)),
    });
  }

  return summaries;
}

/**
 * Groups games by league for the main feed sections.
 */
export function groupGamesByLeague(
  games: SportsGame[],
): { id: string; label: string; games: SportsGame[] }[] {
  const sections: { id: string; label: string; games: SportsGame[] }[] = [];
  const used = new Set<string>();

  for (const section of SPORTS_LEAGUE_SECTIONS) {
    const matched = sortSportsLiveGames(
      games.filter((game) => game.leagueId === section.id),
    );
    if (matched.length > 0) {
      sections.push({
        id: section.id,
        label: section.label,
        games: matched,
      });
      for (const game of matched) {
        used.add(game.gameId);
      }
    }
  }

  const remaining = sortSportsLiveGames(
    games.filter((game) => !used.has(game.gameId)),
  );
  if (remaining.length > 0) {
    sections.push({ id: 'other', label: 'OTHER', games: remaining });
  }

  return sections;
}
