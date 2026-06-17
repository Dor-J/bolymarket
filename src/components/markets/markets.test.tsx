import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MarketTopicRail } from './MarketTopicRail';
import { ShowMoreMarketsButton } from './ShowMoreMarketsButton';

describe('MarketTopicRail', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders active chip styling and handles selection', () => {
    const onSelect = vi.fn();

    render(
      <MarketTopicRail
        items={[
          { id: 'all', label: 'All', count: 10 },
          { id: 'trump', label: 'Trump', count: 5 },
        ]}
        selectedId="all"
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByRole('tab', { name: /Trump 5/ }));
    expect(onSelect).toHaveBeenCalledWith('trump');
  });
});

describe('ShowMoreMarketsButton', () => {
  it('calls onClick when pressed', () => {
    const onClick = vi.fn();
    render(<ShowMoreMarketsButton onClick={onClick} />);

    fireEvent.click(screen.getByRole('button', { name: 'Show more markets' }));
    expect(onClick).toHaveBeenCalled();
  });
});
