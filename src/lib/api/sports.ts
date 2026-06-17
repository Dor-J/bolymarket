import {
  GAMMA_EVENTS_ORDER,
} from '@/lib/constants/gamma';
import type { SportsEvent, SportsMetadata, TeamInfo } from '@/types/polymarket';
import { normalizeSportsEvents } from './normalize';
import {
  gammaEventsResponseSchema,
  gammaSportsMetadataSchema,
  gammaTeamsResponseSchema,
  type GammaEvent,
  type GammaTeam,
} from './schemas';

const GAMMA_API_BASE = 'https://gamma-api.polymarket.com';
const SPORTS_EVENTS_PAGE_SIZE = 100;
const SPORTS_EVENTS_MAX_PAGES = 8;

export interface FetchSportsLiveEventsOptions {
  signal?: AbortSignal;
}

function normalizeTeam(team: GammaTeam): TeamInfo | null {
  const name = team.name?.trim();
  if (!name) {
    return null;
  }

  const id =
    typeof team.id === 'number' ? team.id : Number.parseInt(String(team.id), 10);

  return {
    id: Number.isFinite(id) ? id : 0,
    name,
    abbreviation: team.abbreviation?.toUpperCase() ?? name.slice(0, 3).toUpperCase(),
    record: team.record,
    logo: team.logo,
    league: team.league,
    color: typeof team.color === 'string' ? team.color : undefined,
  };
}

/**
 * Fetches sports metadata from Gamma `/sports`.
 */
export async function fetchSportsMetadata(
  signal?: AbortSignal,
): Promise<SportsMetadata[]> {
  const response = await fetch(`${GAMMA_API_BASE}/sports`, {
    headers: { Accept: 'application/json' },
    signal,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(
      `Gamma sports metadata error: ${response.status} ${response.statusText}`,
    );
  }

  const json: unknown = await response.json();
  return gammaSportsMetadataSchema.parse(json).map((entry) => ({
    sport: entry.sport,
    image: entry.image,
    resolution: entry.resolution,
    ordering: entry.ordering,
    tags: entry.tags,
    series: entry.series,
  }));
}

/**
 * Fetches teams for the given league abbreviations (paginated).
 */
export async function fetchTeams(
  leagues: string[],
  signal?: AbortSignal,
): Promise<TeamInfo[]> {
  const teams: TeamInfo[] = [];
  const uniqueLeagues = [...new Set(leagues.filter(Boolean))];

  for (const league of uniqueLeagues) {
    let offset = 0;

    while (true) {
      const params = new URLSearchParams({
        league,
        limit: '100',
        offset: String(offset),
      });

      const response = await fetch(`${GAMMA_API_BASE}/teams?${params}`, {
        headers: { Accept: 'application/json' },
        signal,
        cache: 'no-store',
      });

      if (!response.ok) {
        break;
      }

      const json: unknown = await response.json();
      const page = gammaTeamsResponseSchema.parse(json);
      if (page.length === 0) {
        break;
      }

      for (const team of page) {
        const normalized = normalizeTeam(team);
        if (normalized) {
          teams.push(normalized);
        }
      }

      if (page.length < 100) {
        break;
      }

      offset += 100;
    }
  }

  return teams;
}

/**
 * Builds a team lookup map keyed by stringified team id.
 */
export function buildTeamLookup(teams: TeamInfo[]): Map<string, TeamInfo> {
  const lookup = new Map<string, TeamInfo>();

  for (const team of teams) {
    lookup.set(String(team.id), team);
  }

  return lookup;
}

async function fetchSportsEventsPage(
  offset: number,
  signal?: AbortSignal,
): Promise<GammaEvent[]> {
  const params = new URLSearchParams({
    closed: 'false',
    active: 'true',
    order: GAMMA_EVENTS_ORDER,
    ascending: 'false',
    tag_slug: 'sports',
    related_tags: 'true',
    limit: String(SPORTS_EVENTS_PAGE_SIZE),
    offset: String(offset),
  });

  const response = await fetch(`${GAMMA_API_BASE}/events?${params}`, {
    headers: { Accept: 'application/json' },
    signal,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(
      `Gamma sports events error: ${response.status} ${response.statusText}`,
    );
  }

  const json: unknown = await response.json();
  return gammaEventsResponseSchema.parse(json);
}

/**
 * Fetches sports live events with offset-based pagination.
 */
export async function fetchSportsLiveEvents(
  options: FetchSportsLiveEventsOptions = {},
): Promise<SportsEvent[]> {
  const rawEvents: GammaEvent[] = [];

  for (let page = 0; page < SPORTS_EVENTS_MAX_PAGES; page += 1) {
    const batch = await fetchSportsEventsPage(
      page * SPORTS_EVENTS_PAGE_SIZE,
      options.signal,
    );

    rawEvents.push(...batch);

    if (batch.length < SPORTS_EVENTS_PAGE_SIZE) {
      break;
    }
  }

  return normalizeSportsEvents(rawEvents);
}

/**
 * Maps sports metadata sport slugs to league section ids for sidebar icons.
 */
export function buildMetadataIconMap(
  metadata: SportsMetadata[],
): Map<string, string> {
  const icons = new Map<string, string>();

  for (const entry of metadata) {
    if (!entry.image) {
      continue;
    }

    icons.set(entry.sport, entry.image);
  }

  return icons;
}
