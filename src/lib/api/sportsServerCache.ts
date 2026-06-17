import 'server-only';

import { EVENTS_CACHE_TTL_MS } from '@/lib/cache/constants';
import { readServerCache, writeServerCache } from '@/lib/cache/serverCache';
import { SPORTS_LEAGUE_SECTIONS } from '@/lib/markets/constants';
import {
  buildLeagueSummaries,
  buildSportsFuturesFromEvents,
  buildSportsGamesFromEvents,
} from '@/lib/sports/buildSportsGameCard';
import type { SportsLiveResponse } from '@/types/polymarket';
import {
  buildMetadataIconMap,
  buildTeamLookup,
  fetchSportsLiveEvents,
  fetchSportsMetadata,
  fetchTeams,
} from './sports';

const REDIS_SPORTS_LIVE_KEY = 'bolymarket:sports:live';

/**
 * Server-side: loads sports live games with Redis + memory cache.
 */
export async function getCachedSportsLiveGames(): Promise<SportsLiveResponse> {
  const cached = await readServerCache<SportsLiveResponse>(REDIS_SPORTS_LIVE_KEY);
  if (cached) {
    return cached.data;
  }

  const [events, metadata] = await Promise.all([
    fetchSportsLiveEvents(),
    fetchSportsMetadata(),
  ]);

  const leagues = SPORTS_LEAGUE_SECTIONS.map((section) => section.id);
  const teams = await fetchTeams(leagues);
  const teamLookup = buildTeamLookup(teams);
  const games = buildSportsGamesFromEvents(events, teamLookup);
  const futuresGames = buildSportsFuturesFromEvents(events, teamLookup);
  const metadataIcons = buildMetadataIconMap(metadata);

  const payload: SportsLiveResponse = {
    games,
    futuresGames,
    leagues: buildLeagueSummaries(games, metadataIcons),
    fetchedAt: new Date().toISOString(),
  };

  await writeServerCache(REDIS_SPORTS_LIVE_KEY, payload, EVENTS_CACHE_TTL_MS);
  return payload;
}
