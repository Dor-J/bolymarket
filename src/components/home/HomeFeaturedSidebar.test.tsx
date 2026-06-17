import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { HomeFeaturedSidebar } from './HomeFeaturedSidebar';
import { HomeHotTopicsPanel } from './HomeHotTopicsPanel';
import { WorldCupComboCard } from './WorldCupComboCard';
import { HOT_TOPICS } from '@/lib/constants/hotTopics';
import { renderWithProviders } from '@/test/test-utils';

describe('WorldCupComboCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders combo promo copy and CTA', () => {
    renderWithProviders(<WorldCupComboCard />);

    expect(
      screen.getByRole('heading', { name: 'Build a World Cup combo' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute(
      'href',
      '/sports/world-cup/games',
    );
  });
});

describe('HomeHotTopicsPanel', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders ranked hot topics', () => {
    renderWithProviders(<HomeHotTopicsPanel />);

    expect(screen.getByRole('heading', { name: 'Hot topics' })).toBeInTheDocument();
    for (const topic of HOT_TOPICS) {
      expect(screen.getByText(topic.label)).toBeInTheDocument();
      expect(screen.getByText(`${topic.volumeLabel} today`)).toBeInTheDocument();
    }
  });
});

describe('HomeFeaturedSidebar', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders combo card, hot topics, and explore link', () => {
    renderWithProviders(<HomeFeaturedSidebar />);

    expect(
      screen.getByRole('heading', { name: 'Build a World Cup combo' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Hot topics' })).toBeInTheDocument();
    expect(screen.getByText('Explore all')).toBeInTheDocument();
  });
});
