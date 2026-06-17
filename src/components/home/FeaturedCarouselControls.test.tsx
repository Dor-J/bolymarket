import { cleanup, fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FeaturedCarouselControls } from './FeaturedCarouselControls';
import { createMockEvent } from '@/test/fixtures/events';
import { renderWithProviders } from '@/test/test-utils';

const events = [
  createMockEvent({ id: '1', title: 'World Cup Winner' }),
  createMockEvent({ id: '2', title: 'Election 2028' }),
  createMockEvent({ id: '3', title: 'Ghana vs. Panama' }),
];

describe('FeaturedCarouselControls', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders pagination dots and adjacent market labels', () => {
    renderWithProviders(
      <FeaturedCarouselControls
        events={events}
        activeIndex={1}
        onSelect={() => undefined}
        onPrevious={() => undefined}
        onNext={() => undefined}
      />,
    );

    expect(screen.getAllByRole('button', { name: /^Show featured market \d+$/ })).toHaveLength(
      3,
    );
    expect(
      screen.getAllByRole('button', { name: 'Previous featured market: World Cup Winner' })
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('button', { name: 'Next featured market: Ghana vs. Panama' })
        .length,
    ).toBeGreaterThan(0);
    expect(screen.getByText('World Cup Winner')).toBeInTheDocument();
    expect(screen.getByText('Ghana vs. Panama')).toBeInTheDocument();
  });

  it('calls navigation handlers', () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();

    renderWithProviders(
      <FeaturedCarouselControls
        events={events}
        activeIndex={1}
        onSelect={() => undefined}
        onPrevious={onPrevious}
        onNext={onNext}
      />,
    );

    fireEvent.click(
      screen.getAllByRole('button', {
        name: 'Previous featured market: World Cup Winner',
      })[0]!,
    );
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Next featured market: Ghana vs. Panama' })[0]!,
    );

    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
