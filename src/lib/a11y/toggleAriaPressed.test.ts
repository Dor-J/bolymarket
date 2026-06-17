import { describe, expect, it } from 'vitest';
import { toggleAriaPressed } from './toggleAriaPressed';

describe('toggleAriaPressed', () => {
  it('returns string literals for SSR-safe toggle state', () => {
    expect(toggleAriaPressed(true)).toBe('true');
    expect(toggleAriaPressed(false)).toBe('false');
  });
});
