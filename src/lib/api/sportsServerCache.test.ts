import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCachedSportsLiveGames } from './sportsServerCache';

const cacheMocks = vi.hoisted(() => ({
  readServerCache: vi.fn(),
  writeServerCache: vi.fn(),
}));

const sportsMocks = vi.hoisted(() => ({
  buildMetadataIconMap: vi.fn(),
  buildTeamLookup: vi.fn(),
  fetchSportsLiveEvents: vi.fn(),
  fetchSportsMetadata: vi.fn(),
  fetchTeams: vi.fn(),
}));

const builderMocks = vi.hoisted(() => ({
  buildLeagueSummaries: vi.fn(),
  buildSportsFuturesFromEvents: vi.fn(),
  buildSportsGamesFromEvents: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('@/lib/cache/serverCache', () => cacheMocks);
vi.mock('./sports', () => sportsMocks);
vi.mock('@/lib/sports/buildSportsGameCard', () => builderMocks);

describe('getCachedSportsLiveGames', () => {
  beforeEach(() => {
    cacheMocks.readServerCache.mockReset();
    cacheMocks.writeServerCache.mockReset();
    sportsMocks.buildMetadataIconMap.mockReset();
    sportsMocks.buildTeamLookup.mockReset();
    sportsMocks.fetchSportsLiveEvents.mockReset();
    sportsMocks.fetchSportsMetadata.mockReset();
    sportsMocks.fetchTeams.mockReset();
    builderMocks.buildLeagueSummaries.mockReset();
    builderMocks.buildSportsFuturesFromEvents.mockReset();
    builderMocks.buildSportsGamesFromEvents.mockReset();
  });

  it('returns cached sports live data without fetching dependencies', async () => {
    const cachedPayload = {
      games: [],
      futuresGames: [],
      leagues: [],
      fetchedAt: '2026-06-20T00:00:00.000Z',
    };
    cacheMocks.readServerCache.mockResolvedValue({ data: cachedPayload });

    await expect(getCachedSportsLiveGames()).resolves.toBe(cachedPayload);

    expect(cacheMocks.readServerCache).toHaveBeenCalledWith(
      'bolymarket:sports:live',
    );
    expect(sportsMocks.fetchSportsLiveEvents).not.toHaveBeenCalled();
    expect(cacheMocks.writeServerCache).not.toHaveBeenCalled();
  });

  it('builds and caches sports live data on cache miss', async () => {
    const events = [{ id: 'event-1' }];
    const metadata = [{ sport: 'soccer', image: 'icon.png' }];
    const teams = [{ id: 'team-1', name: 'France' }];
    const teamLookup = new Map([['france', teams[0]]]);
    const metadataIcons = new Map([['soccer', 'icon.png']]);
    const games = [{ gameId: 'game-1' }];
    const futuresGames = [{ gameId: 'future-1' }];
    const leagues = [{ id: 'soccer', label: 'Soccer', count: 1 }];

    cacheMocks.readServerCache.mockResolvedValue(null);
    sportsMocks.fetchSportsLiveEvents.mockResolvedValue(events);
    sportsMocks.fetchSportsMetadata.mockResolvedValue(metadata);
    sportsMocks.fetchTeams.mockResolvedValue(teams);
    sportsMocks.buildTeamLookup.mockReturnValue(teamLookup);
    sportsMocks.buildMetadataIconMap.mockReturnValue(metadataIcons);
    builderMocks.buildSportsGamesFromEvents.mockReturnValue(games);
    builderMocks.buildSportsFuturesFromEvents.mockReturnValue(futuresGames);
    builderMocks.buildLeagueSummaries.mockReturnValue(leagues);

    const payload = await getCachedSportsLiveGames();

    expect(sportsMocks.fetchTeams).toHaveBeenCalledWith(expect.any(Array));
    expect(builderMocks.buildSportsGamesFromEvents).toHaveBeenCalledWith(
      events,
      teamLookup,
    );
    expect(builderMocks.buildSportsFuturesFromEvents).toHaveBeenCalledWith(
      events,
      teamLookup,
    );
    expect(builderMocks.buildLeagueSummaries).toHaveBeenCalledWith(
      games,
      metadataIcons,
    );
    expect(payload).toEqual({
      games,
      futuresGames,
      leagues,
      fetchedAt: expect.any(String),
    });
    expect(cacheMocks.writeServerCache).toHaveBeenCalledWith(
      'bolymarket:sports:live',
      payload,
      60_000,
    );
  });
});
