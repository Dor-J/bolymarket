import { describe, expect, it } from 'vitest';
import { createMockEvent } from '@/test/fixtures/events';
import { formatBreadcrumb } from './formatBreadcrumb';

describe('formatBreadcrumb', () => {
  it('joins category and first tag', () => {
    const event = createMockEvent({
      id: '1',
      slug: 'world-cup',
      title: 'World Cup',
      category: 'sports',
      tags: ['soccer', 'world-cup'],
    });

    expect(formatBreadcrumb(event)).toBe('Sports · Soccer');
  });

  it('returns null when no category or tags exist', () => {
    const event = createMockEvent({
      id: '2',
      slug: 'generic',
      title: 'Generic',
      tags: [],
    });

    expect(formatBreadcrumb(event)).toBeNull();
  });
});
