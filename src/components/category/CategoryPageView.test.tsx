import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CategoryPageView } from './CategoryPageView';
import { renderWithProviders } from '@/test/test-utils';
import { mockEvents } from '@/test/fixtures/events';

vi.mock('@/hooks/useCategoryEvents', () => ({
  useCategoryEvents: vi.fn(),
}));

import { useCategoryEvents } from '@/hooks/useCategoryEvents';

const mockedUseCategoryEvents = vi.mocked(useCategoryEvents);

describe('CategoryPageView', () => {
  it('renders category title and markets heading', () => {
    mockedUseCategoryEvents.mockReturnValue({
      events: mockEvents,
      isLoading: false,
      isError: false,
      isFetching: false,
      error: null,
      refetch: vi.fn(),
      searchQuery: '',
      debouncedSearch: '',
    } as ReturnType<typeof useCategoryEvents>);

    renderWithProviders(<CategoryPageView tag="crypto" />);

    expect(
      screen.getByRole('heading', { name: 'Crypto', level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Crypto markets' }),
    ).toBeInTheDocument();
  });
});
