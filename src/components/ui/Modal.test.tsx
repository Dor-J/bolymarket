import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { AuthModal } from './Modal';

describe('AuthModal', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the Polymarket-style authentication dialog', () => {
    renderWithProviders(<AuthModal open mode="signup" onClose={vi.fn()} />);

    expect(screen.getByRole('dialog', { name: 'Authentication' })).toBeInTheDocument();
    expect(screen.getByText('Welcome to Bolymarket')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Continue with Telegram' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue with Steam' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue with MetaMask' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue with Coinbase' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue with Rabby' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue with Phantom' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Continue with wallet connect' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More methods' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/tos');
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
  });
});
