import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MobileBottomNav } from './MobileBottomNav';
import { renderWithProviders } from '@/test/test-utils';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

describe('MobileBottomNav', () => {
  it('renders the four mobile navigation items', () => {
    renderWithProviders(<MobileBottomNav />);

    expect(screen.getByRole('navigation', { name: /mobile/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /breaking/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /more/i })).toBeInTheDocument();
  });
});
