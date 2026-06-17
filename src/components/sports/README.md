# Sports components

UI for the sports live experience (`/sports/live`) and shared sports layout chrome.

## Page

| Component | Role |
| --------- | ---- |
| `SportsLivePageView` | Main orchestrator — leagues, games, trade widget, WebSocket subscription |
| `SportsLiveHeader` | Page title + live refresh metadata |
| `SportsPageLayout` | Two-column shell — main content + sidebar |

## Game list

| Component | Role |
| --------- | ---- |
| `SportsLeagueSection` | League header + grouped game rows |
| `SportsMarketRow` | Single game row — teams, scores, market buttons |
| `SportsWorldCupBanner` | World Cup promo strip |

## Sidebar / trading

| Component | Role |
| --------- | ---- |
| `SportsSidebar` | Right column — related markets, navigation |
| `SportsTradeWidget` | Visual trade panel for selected game market |

## Hooks used

- `useSportsLiveGames` — React Query fetch for `/api/sports/live`
- `useSportsGameResults` — ref-counted sports WebSocket for visible `gameId`s

## Related lib

- `lib/sports/` — market classification, team abbreviations, game card builder
- `lib/api/sports.ts` — Gamma sports fetch + normalization
- `lib/realtime/sportsWebSocketEngine.ts` — live scores / game state

## Route

`/sports/live` → `app/sports/live/page.tsx` renders `SportsLivePageView`.
