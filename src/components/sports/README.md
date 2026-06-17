# Sports components

UI for the sports live experience (`/sports/live`) and shared sports layout chrome.

## Page

| Component | Role |
| --------- | ---- |
| `SportsLivePageView` | Main orchestrator — Live/Futures tabs, leagues, games, trade widget, WebSocket |
| `SportsLiveHeader` | Page title + expandable search |
| `SportsPageLayout` | Three-column shell — sidebar, feed, trade widget |

## Game list

| Component | Role |
| --------- | ---- |
| `SportsLeagueSection` | League header + grouped game rows |
| `SportsMarketRow` | Single game row — teams, scores, moneyline/spread/total buttons |
| `SportsWorldCupBanner` | World Cup promo strip with curved flag layout |

## Sidebar / trading

| Component | Role |
| --------- | ---- |
| `SportsSidebar` | Live/Futures tabs, expandable sport groups, league counts/icons |
| `SportsTradeWidget` | Polymarket-style trade panel for selected outcome |

## Hooks used

- `useSportsLiveGames` — React Query fetch for `/api/sports/live`
- `useSportsGameResults` — ref-counted sports WebSocket for visible games
- `useSportsGameState` — resolves live score/state via gameId, slug, or matchup key

## Related lib

- `lib/sports/buildSportsGameCard.ts` — game assembly, More Markets merge, league ordering
- `lib/sports/teamLookup.ts` — multi-key team resolution (id, name, alias, abbrev)
- `lib/sports/sortSportsLiveGames.ts` — MLB-first live feed ordering
- `lib/sports/sidebarNav.ts` — Polymarket-aligned sidebar tree + count helpers
- `lib/sports/sportIcons.ts` — curated league icon URLs for rows/widgets
- `lib/format/sportsVolume.ts` / `sportsPrice.ts` — Polymarket-style volume and rounded cents
- `lib/api/sports.ts` — Gamma sports fetch + normalization
- `lib/realtime/sportsWebSocketEngine.ts` — live scores / game state

## Route

`/sports/live` → `app/sports/live/page.tsx` renders `SportsLivePageView`.
