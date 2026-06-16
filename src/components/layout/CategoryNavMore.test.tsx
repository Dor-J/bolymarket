import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { CategoryNavMore } from './CategoryNavMore';
import { renderWithProviders } from '@/test/test-utils';

describe('CategoryNavMore', () => {
  beforeEach(() => {
    cleanup();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('opens the dropdown on hover', () => {
    renderWithProviders(<CategoryNavMore />);

    const trigger = screen.getByRole('button', {
      name: 'Open more navigation links',
    });

    expect(screen.queryByRole('menuitem', { name: /^new$/i })).toBeNull();

    fireEvent.mouseEnter(trigger.closest('div')!);
    expect(screen.getByRole('menuitem', { name: /^new$/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /rewards/i })).toBeInTheDocument();
  });

  it('closes the dropdown after mouse leave', () => {
    renderWithProviders(<CategoryNavMore />);

    const container = screen
      .getByRole('button', { name: 'Open more navigation links' })
      .closest('div')!;

    fireEvent.mouseEnter(container);
    expect(screen.getByRole('menuitem', { name: /leaderboard/i })).toBeInTheDocument();

    fireEvent.mouseLeave(container);
    act(() => {
      vi.advanceTimersByTime(120);
    });

    expect(screen.queryByRole('menuitem', { name: /leaderboard/i })).toBeNull();
  });
});
