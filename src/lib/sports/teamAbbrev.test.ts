import { describe, expect, it } from 'vitest';
import { getTeamAbbrev } from './teamAbbrev';

describe('getTeamAbbrev', () => {
  it('abbreviates multi-word team names', () => {
    expect(getTeamAbbrev('Atlanta Braves')).toBe('AB');
    expect(getTeamAbbrev('Chicago White Sox')).toBe('CWS');
    expect(getTeamAbbrev('Braves')).toBe('BRA');
  });

  it('handles draw outcomes', () => {
    expect(getTeamAbbrev('Draw')).toBe('DRAW');
  });
});
