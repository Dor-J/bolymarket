import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { createMockEvent } from '@/test/fixtures/events';
import { renderWithProviders } from '@/test/test-utils';
import { EventHeader } from './EventHeader';

describe('EventHeader', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the Polymarket-style event header', () => {
    const event = createMockEvent({
      id: 'world-cup',
      slug: 'world-cup-winner',
      title: 'World Cup Winner',
      category: 'sports',
      tags: ['soccer'],
    });

    renderWithProviders(<EventHeader event={event} />);

    expect(screen.getByRole('heading', { name: 'World Cup Winner' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sports' })).toHaveAttribute(
      'href',
      '/sports/live',
    );
    expect(screen.getByRole('link', { name: 'Soccer' })).toHaveAttribute(
      'href',
      '/predictions/soccer',
    );
    expect(screen.getByRole('button', { name: 'Embed event' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy event link' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bookmark market' })).toBeInTheDocument();
  });
});
