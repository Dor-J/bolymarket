import { describe, expect, it } from 'vitest';
import {
  buildWorldCupFlagGrid,
  getDefaultVisibleFlagIndices,
  getWorldCupTeamFlagUrl,
  pickVisibleFlagIndices,
  WORLD_CUP_FLAG_CODES,
} from '@/lib/sports/worldCupFlags';

describe('buildWorldCupFlagGrid', () => {
  it('repeats flag codes to fill the grid', () => {
    const grid = buildWorldCupFlagGrid(6);
    expect(grid).toEqual([
      WORLD_CUP_FLAG_CODES[0],
      WORLD_CUP_FLAG_CODES[1],
      WORLD_CUP_FLAG_CODES[2],
      WORLD_CUP_FLAG_CODES[3],
      WORLD_CUP_FLAG_CODES[4],
      WORLD_CUP_FLAG_CODES[5],
    ]);
  });
});

describe('getDefaultVisibleFlagIndices', () => {
  it('returns a stable spread of indices', () => {
    const first = getDefaultVisibleFlagIndices(84, 10);
    const second = getDefaultVisibleFlagIndices(84, 10);

    expect(first).toEqual(second);
    expect(first.size).toBe(10);
  });
});

describe('pickVisibleFlagIndices', () => {
  it('returns the requested number of unique indices', () => {
    const indices = pickVisibleFlagIndices(20, 8, () => 0.25);
    expect(indices.size).toBe(8);
  });
});

describe('getWorldCupTeamFlagUrl', () => {
  it('resolves World Cup country names to flag URLs', () => {
    expect(getWorldCupTeamFlagUrl('Netherlands')).toContain('/nld.png');
    expect(getWorldCupTeamFlagUrl('DR Congo')).toContain('/cod.png');
  });
});
