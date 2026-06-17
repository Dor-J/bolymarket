/**
 * Curated sport icon URLs keyed by league section id.
 */
export const SPORT_ICON_URLS: Record<string, string> = {
  'world-cup':
    'https://polymarket-upload.s3.us-east-2.amazonaws.com/world-cup-winner-spain-flag-20260603-192743.png',
  mlb: 'https://polymarket-upload.s3.us-east-2.amazonaws.com/Repetitive-markets/MLB.jpg',
  nba: 'https://polymarket-upload.s3.us-east-2.amazonaws.com/super+cool+basketball+in+red+and+blue+wow.png',
  nfl: 'https://polymarket-upload.s3.us-east-2.amazonaws.com/nfl.png',
  nhl: 'https://polymarket-upload.s3.us-east-2.amazonaws.com/nhl.png',
  atp: 'https://polymarket-upload.s3.us-east-2.amazonaws.com/atp-tour-b4390c4fb8.jpg',
  wta: 'https://polymarket-upload.s3.us-east-2.amazonaws.com/wta-logo.png',
  soccer:
    'https://polymarket-upload.s3.us-east-2.amazonaws.com/Repetitive-markets/premier+league.jpg',
  ufc: 'https://polymarket-upload.s3.us-east-2.amazonaws.com/ufc.png',
};

/**
 * Resolves a sport icon URL for a league id.
 */
export function getSportIconUrl(
  leagueId: string,
  metadataIcon?: string,
): string | undefined {
  return metadataIcon ?? SPORT_ICON_URLS[leagueId];
}
