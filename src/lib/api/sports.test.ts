import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildMetadataIconMap,
  buildTeamLookup,
  fetchSportsLiveEvents,
  fetchSportsMetadata,
  fetchTeams,
} from './sports';

const gammaSportsEvent = {
  id: 'event-1',
  slug: 'france-vs-brazil',
  title: 'France vs Brazil',
  category: 'Sports',
  volume: 1000,
  markets: [
    {
      id: 'market-1',
      question: 'France vs Brazil',
      outcomes: ['France', 'Brazil'],
      outcomePrices: ['0.55', '0.45'],
      clobTokenIds: ['france-token', 'brazil-token'],
    },
  ],
};

describe('sports API helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches and normalizes sports metadata', async () => {
    const signal = new AbortController().signal;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          sport: 'soccer',
          image: 'https://example.com/soccer.png',
          resolution: 'daily',
        },
      ],
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchSportsMetadata(signal)).resolves.toEqual([
      {
        sport: 'soccer',
        image: 'https://example.com/soccer.png',
        resolution: 'daily',
        ordering: undefined,
        tags: undefined,
        series: undefined,
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith('https://gamma-api.polymarket.com/sports', {
      headers: { Accept: 'application/json' },
      signal,
      cache: 'no-store',
    });
  });

  it('throws when sports metadata fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      }),
    );

    await expect(fetchSportsMetadata()).rejects.toThrow(
      'Gamma sports metadata error: 500 Internal Server Error',
    );
  });

  it('fetches unique team leagues and stops pagination on short pages', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: '1',
          name: 'France',
          league: 'world-cup',
          abbreviation: 'FRA',
        },
      ],
    });
    vi.stubGlobal('fetch', fetchMock);

    const teams = await fetchTeams(['world-cup', 'world-cup', '']);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('league=world-cup');
    expect(teams).toEqual([
      expect.objectContaining({
        id: 1,
        name: 'France',
        abbreviation: 'FRA',
      }),
    ]);
  });

  it('fetches and normalizes sports live events', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [gammaSportsEvent],
    });
    vi.stubGlobal('fetch', fetchMock);

    const events = await fetchSportsLiveEvents();

    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('tag_slug=sports');
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      id: 'event-1',
      slug: 'france-vs-brazil',
      title: 'France vs Brazil',
    });
  });

  it('builds team and metadata lookup maps', () => {
    const teamLookup = buildTeamLookup([
      { id: '1', name: 'France', abbreviation: 'FRA' },
    ]);
    const iconMap = buildMetadataIconMap([
      { sport: 'soccer', image: 'https://example.com/soccer.png' },
      { sport: 'empty' },
    ]);

    expect(teamLookup.byKey.get('france')).toEqual(
      expect.objectContaining({ name: 'France' }),
    );
    expect(iconMap).toEqual(
      new Map([['soccer', 'https://example.com/soccer.png']]),
    );
  });
});
