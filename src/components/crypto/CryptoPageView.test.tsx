import { cleanup, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { CryptoPageView } from './CryptoPageView';

vi.mock('@/hooks/useCategoryEvents', () => ({
  useCategoryEvents: vi.fn(),
}));

vi.mock('@/hooks/useLivePrices', () => ({
  useLivePrices: vi.fn(),
}));

import { useCategoryEvents } from '@/hooks/useCategoryEvents';

const mockedUseCategoryEvents = vi.mocked(useCategoryEvents);

describe('CryptoPageView', () => {
  beforeEach(() => {
    mockedUseCategoryEvents.mockReturnValue({
      events: [],
      isLoading: false,
      isError: false,
      isFetching: false,
      error: null,
      refetch: vi.fn(),
    } as ReturnType<typeof useCategoryEvents>);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders Polymarket-style crypto tabs and header controls', () => {
    renderWithProviders(<CryptoPageView />);

    expect(screen.getByRole('heading', { name: 'Crypto', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Up / Down' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Above / Below' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Price Range' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Hit Price' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open search' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Toggle filters' })).toBeInTheDocument();
  });

  it('updates the active tab, expands search, and shows filter chips', () => {
    renderWithProviders(<CryptoPageView />);

    fireEvent.click(screen.getByRole('tab', { name: 'Up / Down' }));
    expect(screen.getByRole('tab', { name: 'Up / Down' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open search' }));
    expect(screen.getByRole('searchbox', { name: 'Search crypto markets' })).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Toggle filters' }));
    expect(screen.getByRole('button', { name: '24hr Volume' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Toggle filters' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('opens the period filter menu from the All chip', () => {
    renderWithProviders(<CryptoPageView />);

    fireEvent.click(screen.getByRole('button', { name: 'Toggle filters' }));

    const allButtons = screen.getAllByRole('button', { name: 'All' });
    const periodFilterButton = allButtons[allButtons.length - 1];
    fireEvent.click(periodFilterButton);

    const menu = screen.getByRole('menu');
    expect(within(menu).getByRole('menuitem', { name: 'Daily' })).toBeInTheDocument();
    expect(within(menu).getByRole('menuitem', { name: 'Weekly' })).toBeInTheDocument();
    expect(within(menu).getByRole('menuitem', { name: 'Monthly' })).toBeInTheDocument();
    expect(within(menu).getByRole('menuitem', { name: 'All' })).toBeInTheDocument();

    fireEvent.click(within(menu).getByRole('menuitem', { name: 'Daily' }));

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens the sort filter menu from the 24hr Volume chip', () => {
    renderWithProviders(<CryptoPageView />);

    fireEvent.click(screen.getByRole('button', { name: 'Toggle filters' }));
    fireEvent.click(screen.getByRole('button', { name: '24hr Volume' }));

    const menu = screen.getByRole('menu');
    expect(within(menu).getByRole('menuitem', { name: '24hr Volume' })).toBeInTheDocument();
    expect(within(menu).getByRole('menuitem', { name: 'Total Volume' })).toBeInTheDocument();
    expect(within(menu).getByRole('menuitem', { name: 'Liquidity' })).toBeInTheDocument();
    expect(within(menu).getByRole('menuitem', { name: 'Newest' })).toBeInTheDocument();
    expect(within(menu).getByRole('menuitem', { name: 'Ending Soon' })).toBeInTheDocument();
    expect(within(menu).getByRole('menuitem', { name: 'Competitive' })).toBeInTheDocument();
    expect(within(menu).getByRole('menuitem', { name: 'Earn 3.25%' })).toBeInTheDocument();

    fireEvent.click(within(menu).getByRole('menuitem', { name: 'Newest' }));

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Newest' })).toBeInTheDocument();
  });
});
