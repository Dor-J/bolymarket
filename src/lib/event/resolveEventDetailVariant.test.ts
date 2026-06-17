import { describe, expect, it } from 'vitest';
import { createMockEvent } from '@/test/fixtures/events';
import { resolveEventDetailVariant } from './resolveEventDetailVariant';

describe('resolveEventDetailVariant', () => {
  it('returns sports-match for match titles', () => {
    const event = createMockEvent({
      id: '1',
      slug: 'match',
      title: 'Argentina vs. Algeria',
      tags: ['sports'],
    });

    expect(resolveEventDetailVariant(event)).toBe('sports-match');
  });

  it('returns crypto-recurring for up/down markets', () => {
    const event = createMockEvent({
      id: '2',
      slug: 'btc',
      title: 'BTC Up or Down - 5 min',
      tags: ['crypto'],
    });

    expect(resolveEventDetailVariant(event)).toBe('crypto-recurring');
  });

  it('returns crypto-price-target for hit price markets', () => {
    const event = createMockEvent({
      id: '3',
      slug: 'btc-hit',
      title: 'What price will Bitcoin hit in June?',
      tags: ['crypto'],
    });

    expect(resolveEventDetailVariant(event)).toBe('crypto-price-target');
  });

  it('returns standard for generic politics events', () => {
    const event = createMockEvent({
      id: '4',
      slug: 'midterms',
      title: 'Balance of Power: 2026 Midterms',
      tags: ['politics'],
    });

    expect(resolveEventDetailVariant(event)).toBe('standard');
  });
});
