import { describe, expect, it } from 'vitest';
import { createMockEvent } from '@/test/fixtures/events';
import {
  getTopOutcomeRows,
  mapEventToBinaryProps,
  mapEventToCardProps,
} from './mapEventToCardProps';
import { resolveCardVariant } from './resolveCardVariant';

describe('getTopOutcomeRows', () => {
  it('returns top two outcomes by price from a multi-outcome market', () => {
    const event = createMockEvent({
      id: '1',
      slug: 'world-cup',
      title: 'World Cup',
      markets: [
        {
          id: 'm1',
          question: 'Winner',
          volume: 100,
          outcomes: [
            { id: 'spain', name: 'Spain', price: 0.16 },
            { id: 'france', name: 'France', price: 0.2 },
            { id: 'brazil', name: 'Brazil', price: 0.1 },
          ],
        },
      ],
    });

    const rows = getTopOutcomeRows(event, 2);

    expect(rows).toHaveLength(2);
    expect(rows[0]?.name).toBe('France');
    expect(rows[1]?.name).toBe('Spain');
  });
});

describe('mapEventToBinaryProps', () => {
  it('maps yes and no prices from a binary market', () => {
    const event = createMockEvent({
      id: '1',
      slug: 'binary',
      title: 'Binary Question',
      markets: [
        {
          id: 'm1',
          question: 'Will X happen?',
          volume: 100,
          outcomes: [
            { id: 'yes', name: 'Yes', price: 0.28 },
            { id: 'no', name: 'No', price: 0.72 },
          ],
        },
      ],
    });

    const props = mapEventToBinaryProps(event);

    expect(props.yesPrice).toBe(0.28);
    expect(props.noPrice).toBe(0.72);
    expect(props.slug).toBe('binary');
  });
});

describe('mapEventToCardProps', () => {
  it('routes binary events to binary props', () => {
    const event = createMockEvent({
      id: '1',
      slug: 'binary',
      title: 'Binary',
      markets: [
        {
          id: 'm1',
          question: 'Q?',
          volume: 1,
          outcomes: [
            { id: 'yes', name: 'Yes', price: 0.5 },
            { id: 'no', name: 'No', price: 0.5 },
          ],
        },
      ],
    });

    const result = mapEventToCardProps(event);

    expect(result.variant).toBe('binary');
    expect(resolveCardVariant(event)).toBe('binary');
  });

  it('routes multi-outcome events to multi props', () => {
    const event = createMockEvent({
      id: '2',
      slug: 'multi',
      title: 'Multi',
      markets: [
        {
          id: 'm1',
          question: 'A',
          volume: 1,
          outcomes: [
            { id: 'a', name: 'A', price: 0.3 },
            { id: 'b', name: 'B', price: 0.3 },
            { id: 'c', name: 'C', price: 0.4 },
          ],
        },
      ],
    });

    const result = mapEventToCardProps(event);

    expect(result.variant).toBe('multi-outcome');
    if (result.variant === 'multi-outcome') {
      expect(result.props.outcomes.length).toBeLessThanOrEqual(2);
    }
  });
});
