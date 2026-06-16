import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BackToTopButton } from './BackToTopButton';
import { renderWithProviders } from '@/test/test-utils';

describe('BackToTopButton', () => {
  it('scrolls to the top when clicked', () => {
    const scrollTo = vi.fn();
    Object.defineProperty(window, 'scrollTo', {
      configurable: true,
      value: scrollTo,
    });

    renderWithProviders(<BackToTopButton />);

    fireEvent.click(screen.getByRole('button', { name: /back to top/i }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
