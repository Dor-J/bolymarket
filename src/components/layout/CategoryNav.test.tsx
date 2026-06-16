import { cleanup, fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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
  beforeEach(() => {
    cleanup();
  });

  it('marks the active functional route with aria-current', () => {
    renderWithProviders(<CategoryNav />);

    const cryptoLink = screen.getByRole('link', { name: /crypto/i });
    expect(cryptoLink).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: /trending/i })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('renders all primary market links and More control', () => {
    renderWithProviders(<CategoryNav />);

    expect(screen.getByRole('link', { name: /world cup/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /elections/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Open more navigation links' }),
    ).toBeInTheDocument();
  });

  it('opens More dropdown items on hover', () => {
    renderWithProviders(<CategoryNav />);

    const container = screen
      .getByRole('button', { name: 'Open more navigation links' })
      .closest('div')!;

    fireEvent.mouseEnter(container);

    expect(screen.getByRole('menuitem', { name: /activity/i })).toBeInTheDocument();
  });
});
