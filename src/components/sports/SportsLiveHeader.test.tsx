import { cleanup, fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { SportsLiveHeader } from './SportsLiveHeader';

describe('SportsLiveHeader', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders separate search and filters controls', () => {
    renderWithProviders(<SportsLiveHeader />);

    expect(
      screen.getByRole('button', { name: 'Search sports markets' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sports filters' })).toBeInTheDocument();
  });

  it('expands the search input from the search button', () => {
    renderWithProviders(<SportsLiveHeader />);

    fireEvent.click(screen.getByRole('button', { name: 'Search sports markets' }));

    expect(screen.getByRole('searchbox', { name: 'Search sports markets' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toHaveFocus();
  });

  it('opens the sports filters dropdown and updates selections', () => {
    renderWithProviders(<SportsLiveHeader />);

    fireEvent.click(screen.getByRole('button', { name: 'Sports filters' }));

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Odds Format')).toBeInTheDocument();
    expect(screen.getByRole('menuitemradio', { name: 'Price' })).toHaveAttribute(
      'aria-checked',
      'true',
    );

    fireEvent.click(screen.getByRole('menuitemradio', { name: 'American' }));

    expect(screen.getByRole('menuitemradio', { name: 'American' })).toHaveAttribute(
      'aria-checked',
      'true',
    );

    const spreadTotalsToggle = screen.getByRole('menuitemcheckbox', {
      name: 'Show Spreads + Totals',
    });
    expect(spreadTotalsToggle).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(spreadTotalsToggle);

    expect(spreadTotalsToggle).toHaveAttribute('aria-checked', 'false');
  });
});
