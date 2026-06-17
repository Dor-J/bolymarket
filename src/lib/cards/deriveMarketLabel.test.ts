import { describe, expect, it } from 'vitest';
import { deriveBinaryMarketLabel } from './deriveMarketLabel';

describe('deriveBinaryMarketLabel', () => {
  it('extracts team names from winner questions', () => {
    expect(
      deriveBinaryMarketLabel('Will France win the 2026 FIFA World Cup?'),
    ).toBe('France');
    expect(
      deriveBinaryMarketLabel('Will Spain win the 2026 FIFA World Cup?'),
    ).toBe('Spain');
  });

  it('extracts candidate names from office-holder questions', () => {
    expect(
      deriveBinaryMarketLabel('Will Gadi Eizenkot be the next Prime Minister of Israel?'),
    ).toBe('Gadi Eizenkot');
    expect(
      deriveBinaryMarketLabel('Will Benjamin Netanyahu be the next Prime Minister of Israel?'),
    ).toBe('Benjamin Netanyahu');
  });

  it('extracts policy demand labels from agree-to questions', () => {
    expect(
      deriveBinaryMarketLabel(
        'Will Trump agree to Iranian Oil Sanction Relief by June 30?',
      ),
    ).toBe('Oil Sanction Relief');
    expect(
      deriveBinaryMarketLabel('Will Trump agree to Unfreeze Iranian Assets by June 30?'),
    ).toBe('Unfreeze Iranian Assets');
  });

  it('falls back to a cleaned question when no compact pattern is known', () => {
    expect(deriveBinaryMarketLabel('Will this happen?')).toBe('this happen');
  });
});
