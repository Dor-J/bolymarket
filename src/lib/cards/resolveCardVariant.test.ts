import { describe, expect, it } from 'vitest';
import { createMockEvent } from '@/test/fixtures/events';
import { resolveCardVariant } from './resolveCardVariant';

describe('resolveCardVariant', () => {
  it('returns binary for a single market with two outcomes', () => {
    const event = createMockEvent({
      id: '1',
      slug: 'binary-event',
      title: 'Binary Event',
      markets: [
        {
          id: 'm1',
          question: 'Will it happen?',
          volume: 100,
          outcomes: [
            { id: 'yes', name: 'Yes', price: 0.6 },
            { id: 'no', name: 'No', price: 0.4 },
          ],
        },
      ],
    });

    expect(resolveCardVariant(event)).toBe('binary');
  });

  it('returns multi-outcome for multiple markets', () => {
    const event = createMockEvent({
      id: '2',
      slug: 'multi-market',
      title: 'Multi Market',
      markets: [
        {
          id: 'm1',
          question: 'Market A',
          volume: 100,
          outcomes: [
            { id: 'yes-a', name: 'Yes', price: 0.5 },
            { id: 'no-a', name: 'No', price: 0.5 },
          ],
        },
        {
          id: 'm2',
          question: 'Market B',
          volume: 200,
          outcomes: [
            { id: 'yes-b', name: 'Yes', price: 0.3 },
            { id: 'no-b', name: 'No', price: 0.7 },
          ],
        },
      ],
    });

    expect(resolveCardVariant(event)).toBe('multi-outcome');
  });

  it('returns multi-outcome for a single market with more than two outcomes', () => {
    const event = createMockEvent({
      id: '3',
      slug: 'world-cup',
      title: 'World Cup Winner',
      markets: [
        {
          id: 'm1',
          question: 'World Cup Winner',
          volume: 100,
          outcomes: [
            { id: 'spain', name: 'Spain', price: 0.16 },
            { id: 'france', name: 'France', price: 0.16 },
            { id: 'brazil', name: 'Brazil', price: 0.14 },
          ],
        },
      ],
    });

    expect(resolveCardVariant(event)).toBe('multi-outcome');
  });
});
