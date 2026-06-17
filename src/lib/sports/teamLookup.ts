import type { TeamInfo } from '@/types/polymarket';
import type { GammaTeam } from '@/lib/api/schemas';

/**
 * Normalizes a team lookup key from a name, alias, or abbreviation.
 */
export function normalizeTeamKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export interface TeamLookup {
  byId: Map<string, TeamInfo>;
  byKey: Map<string, TeamInfo>;
}

function normalizeTeamFromGamma(team: GammaTeam): TeamInfo | null {
  const name = team.name?.trim();
  if (!name) {
    return null;
  }

  const id =
    typeof team.id === 'number' ? team.id : Number.parseInt(String(team.id), 10);

  const alias =
    typeof team.alias === 'string' ? team.alias : undefined;

  return {
    id: Number.isFinite(id) ? id : 0,
    name,
    abbreviation: team.abbreviation?.toUpperCase() ?? name.slice(0, 3).toUpperCase(),
    record: team.record,
    logo: team.logo,
    league: team.league,
    color: typeof team.color === 'string' ? team.color : undefined,
    alias,
  };
}

function registerTeamKeys(lookup: TeamLookup, team: TeamInfo): void {
  lookup.byId.set(String(team.id), team);

  const keys = new Set<string>([
    normalizeTeamKey(team.name),
    normalizeTeamKey(team.abbreviation),
  ]);

  if (team.alias) {
    keys.add(normalizeTeamKey(team.alias));
  }

  for (const key of keys) {
    if (key) {
      lookup.byKey.set(key, team);
    }
  }
}

/**
 * Builds a multi-key team lookup from Gamma team records.
 */
export function buildEnhancedTeamLookup(teams: TeamInfo[]): TeamLookup {
  const lookup: TeamLookup = {
    byId: new Map(),
    byKey: new Map(),
  };

  for (const team of teams) {
    registerTeamKeys(lookup, team);
  }

  return lookup;
}

/**
 * Normalizes Gamma teams into TeamInfo records with alias support.
 */
export function normalizeTeamsFromGamma(rawTeams: GammaTeam[]): TeamInfo[] {
  const teams: TeamInfo[] = [];

  for (const raw of rawTeams) {
    const team = normalizeTeamFromGamma(raw);
    if (team) {
      teams.push(team);
    }
  }

  return teams;
}

/**
 * Resolves a team by id, name, or abbreviation.
 */
export function resolveTeam(
  lookup: TeamLookup,
  input: {
    teamId?: string;
    name?: string;
    abbreviation?: string;
  },
): TeamInfo | undefined {
  if (input.teamId) {
    const byId = lookup.byId.get(input.teamId);
    if (byId) {
      return byId;
    }
  }

  for (const candidate of [input.name, input.abbreviation]) {
    if (!candidate) {
      continue;
    }

    const match = lookup.byKey.get(normalizeTeamKey(candidate));
    if (match) {
      return match;
    }
  }

  return undefined;
}

/**
 * Backward-compatible id-only lookup map.
 */
export function buildTeamLookup(teams: TeamInfo[]): Map<string, TeamInfo> {
  return buildEnhancedTeamLookup(teams).byId;
}
