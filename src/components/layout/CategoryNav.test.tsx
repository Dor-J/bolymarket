import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CategoryNav } from './CategoryNav';
import { renderWithProviders } from '@/test/test-utils';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/crypto'),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('CategoryNav', () => {
  it('marks the active route with aria-current', () => {
    renderWithProviders(<CategoryNav />);

    const cryptoLink = screen.getByRole('link', { name: /crypto/i });
    expect(cryptoLink).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: /trending/i })).not.toHaveAttribute(
      'aria-current',
    );
  });
});
