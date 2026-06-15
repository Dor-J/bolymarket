import { afterEach, describe, expect, it } from 'vitest';
import { migrateLegacyLocalStorage } from './migrateLegacyLocalStorage';

describe('migrateLegacyLocalStorage', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('removes legacy events and per-slug keys', () => {
    window.localStorage.setItem('bolymarket.events.v1', '[]');
    window.localStorage.setItem('bolymarket.event.foo', '{}');
    window.localStorage.setItem('other.key', 'keep');

    migrateLegacyLocalStorage();

    expect(window.localStorage.getItem('bolymarket.events.v1')).toBeNull();
    expect(window.localStorage.getItem('bolymarket.event.foo')).toBeNull();
    expect(window.localStorage.getItem('other.key')).toBe('keep');
  });
});
