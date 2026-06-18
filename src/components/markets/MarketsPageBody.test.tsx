import { cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMockEvent } from '@/test/fixtures/events';
import { renderWithProviders } from '@/test/test-utils';
import { MarketsPageBody } from './MarketsPageBody';

vi.mock('@/hooks/useLivePrices', () => ({
  useLivePrices: vi.fn(),
}));

const events = [
  createMockEvent({ id: '1', slug: 'one', title: 'Event One' }),
  createMockEvent({ id: '2', slug: 'two', title: 'Event Two' }),
  createMockEvent({ id: '3', slug: 'three', title: 'Event Three' }),
  createMockEvent({ id: '4', slug: 'four', title: 'Event Four' }),
];

describe('MarketsPageBody', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders an injected grid card in the third slot', () => {
    const { container } = renderWithProviders(
      <MarketsPageBody
        events={events}
        isLoading={false}
        isError={false}
        isFetching={false}
        error={null}
        onRetry={vi.fn()}
        gridClassName="test-grid"
        thirdGridCard={<div data-testid="third-grid-card">Injected Promo</div>}
      />,
    );

    const grid = container.querySelector('.test-grid');
    expect(grid?.children[2]).toHaveTextContent('Injected Promo');
    expect(grid?.children[3]).toHaveTextContent('Event Three');
  });
});
