/** ISO 3166-1 alpha-3 codes for World Cup participant flags (Polymarket CDN). */
export const WORLD_CUP_FLAG_CODES = [
  'fra',
  'nld',
  'che',
  'aut',
  'egy',
  'jor',
  'zaf',
  'per',
  'deu',
  'usa',
  'tur',
  'civ',
  'hti',
  'irq',
  'ita',
  'arg',
  'mar',
  'sen',
  'sco',
  'nzl',
  'pan',
  'sau',
  'prt',
  'col',
  'ecu',
  'pry',
  'cze',
  'uzb',
  'aus',
  'bra',
  'jpn',
  'hrv',
  'kor',
  'bih',
  'tun',
  'qat',
  'eng',
  'bel',
  'mex',
  'can',
  'dza',
  'irn',
  'cpv',
  'esp',
  'nor',
  'ury',
  'swe',
  'gha',
  'cuw',
  'cod',
] as const;

export type WorldCupFlagCode = (typeof WORLD_CUP_FLAG_CODES)[number];

const FLAG_CDN_BASE =
  'https://polymarket-upload.s3.us-east-2.amazonaws.com/country-flags';

const COUNTRY_FLAG_CODES: Record<string, string> = {
  algeria: 'dza',
  argentina: 'arg',
  australia: 'aus',
  austria: 'aut',
  belgium: 'bel',
  'bosnia and herzegovina': 'bih',
  bosnia: 'bih',
  brazil: 'bra',
  canada: 'can',
  'cape verde': 'cpv',
  'cabo verde': 'cpv',
  colombia: 'col',
  croatia: 'hrv',
  curacao: 'cuw',
  'czech republic': 'cze',
  czechia: 'cze',
  'democratic republic of the congo': 'cod',
  'dr congo': 'cod',
  congo: 'cod',
  ecuador: 'ecu',
  egypt: 'egy',
  england: 'eng',
  france: 'fra',
  germany: 'deu',
  ghana: 'gha',
  haiti: 'hti',
  india: 'ind',
  iran: 'irn',
  iraq: 'irq',
  italy: 'ita',
  'ivory coast': 'civ',
  'cote d ivoire': 'civ',
  japan: 'jpn',
  jordan: 'jor',
  mexico: 'mex',
  morocco: 'mar',
  netherlands: 'nld',
  'new zealand': 'nzl',
  norway: 'nor',
  panama: 'pan',
  paraguay: 'pry',
  peru: 'per',
  portugal: 'prt',
  qatar: 'qat',
  saudi: 'sau',
  'saudi arabia': 'sau',
  scotland: 'sco',
  senegal: 'sen',
  'south africa': 'zaf',
  'south korea': 'kor',
  korea: 'kor',
  spain: 'esp',
  sweden: 'swe',
  switzerland: 'che',
  tunisia: 'tun',
  turkey: 'tur',
  usa: 'usa',
  'united states': 'usa',
  uruguay: 'ury',
  uzbekistan: 'uzb',
};

function normalizeCountryName(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Builds the repeating flag sequence used to fill the banner grid.
 */
export function buildWorldCupFlagGrid(cells: number): WorldCupFlagCode[] {
  const flags: WorldCupFlagCode[] = [];
  for (let index = 0; index < cells; index += 1) {
    flags.push(WORLD_CUP_FLAG_CODES[index % WORLD_CUP_FLAG_CODES.length]);
  }
  return flags;
}

/**
 * Returns a stable spread of visible indices for SSR and first client paint.
 */
export function getDefaultVisibleFlagIndices(
  total: number,
  visibleCount: number,
): Set<number> {
  const count = Math.min(visibleCount, total);
  const step = Math.max(1, Math.floor(total / count));

  return new Set(
    Array.from({ length: count }, (_, index) => (index * step) % total),
  );
}

/**
 * Picks indices that should be visible in the next animation frame.
 */
export function pickVisibleFlagIndices(
  total: number,
  visibleCount: number,
  random: () => number = Math.random,
): Set<number> {
  const count = Math.min(visibleCount, total);
  const pool = Array.from({ length: total }, (_, index) => index);

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const current = pool[index];
    pool[index] = pool[swapIndex]!;
    pool[swapIndex] = current!;
  }

  return new Set(pool.slice(0, count));
}

/**
 * Returns the Polymarket CDN URL for a country flag image.
 */
export function getWorldCupFlagUrl(code: WorldCupFlagCode): string {
  return `${FLAG_CDN_BASE}/${code}.png`;
}

/**
 * Returns a country flag URL for a World Cup team name when one can be inferred.
 */
export function getWorldCupTeamFlagUrl(teamName: string): string | undefined {
  const code = COUNTRY_FLAG_CODES[normalizeCountryName(teamName)];

  return code ? `${FLAG_CDN_BASE}/${code}.png` : undefined;
}
