import { describe, expect, it } from 'vitest';
import {
  buildEnhancedTeamLookup,
  normalizeTeamKey,
  resolveTeam,
} from './teamLookup';
import type { TeamInfo } from '@/types/polymarket';

describe('teamLookup', () => {
  const teams: TeamInfo[] = [
    {
      id: 10,
      name: 'Atlanta Braves',
      abbreviation: 'ATL',
      alias: 'Braves',
      league: 'mlb',
    },
  ];

  const lookup = buildEnhancedTeamLookup(teams);

  it('normalizes lookup keys', () => {
    expect(normalizeTeamKey('Atlanta Braves')).toBe('atlanta braves');
  });

  it('resolves teams by alias and abbreviation', () => {
    expect(resolveTeam(lookup, { name: 'Braves' })?.id).toBe(10);
    expect(resolveTeam(lookup, { abbreviation: 'ATL' })?.id).toBe(10);
    expect(resolveTeam(lookup, { teamId: '10' })?.id).toBe(10);
  });
});
