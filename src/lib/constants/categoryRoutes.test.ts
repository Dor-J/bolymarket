import { describe, expect, it } from 'vitest';
import { isCategoryRouteSlug } from './categoryRoutes';

describe('isCategoryRouteSlug', () => {
  it('accepts valid category slugs', () => {
    expect(isCategoryRouteSlug('crypto')).toBe(true);
    expect(isCategoryRouteSlug('sports')).toBe(true);
    expect(isCategoryRouteSlug('politics')).toBe(true);
  });

  it('rejects invalid slugs', () => {
    expect(isCategoryRouteSlug('trending')).toBe(false);
    expect(isCategoryRouteSlug('')).toBe(false);
  });
});
