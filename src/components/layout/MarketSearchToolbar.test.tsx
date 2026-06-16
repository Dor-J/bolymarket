import { fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MarketSearchToolbar } from './MarketSearchToolbar';
import { renderWithProviders } from '@/test/test-utils';

function createMatchMedia(matches: boolean) {
  const listeners = new Set<() => void>();

  return {
    matches,
    addEventListener: (_event: string, listener: () => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_event: string, listener: () => void) => {
      listeners.delete(listener);
    },
    dispatchChange(nextMatches: boolean) {
      (this as any).matches = nextMatches;
      for (const listener of listeners) {
        listener();
      }
    },
  };
}

describe('MarketSearchToolbar', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the search input and action icons', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(createMatchMedia(false)));

    renderWithProviders(<MarketSearchToolbar />);

    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /toggle filters/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bookmark markets/i })).toBeInTheDocument();
  });

  it('updates the search input value', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(createMatchMedia(false)));

    renderWithProviders(<MarketSearchToolbar />);

    const input = screen.getAllByPlaceholderText('Search')[0] as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'politics' } });

    expect(input.value).toBe('politics');
  });
});

