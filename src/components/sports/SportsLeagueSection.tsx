'use client';

import type { SportsGame, SportsSelection } from '@/types/polymarket';
import { SportsMarketRow } from './SportsMarketRow';
import { cn } from '@/lib/cn';

export interface SportsLeagueSectionProps {
  label: string;
  games: SportsGame[];
  selectedGameId?: string;
  selection?: SportsSelection | null;
  onSelectOutcome?: (selection: SportsSelection) => void;
}

const COLUMN_HEADERS = ['Moneyline', 'Spread', 'Total'] as const;

/**
 * Sectioned sports league group with column headers and compact rows.
 */
export function SportsLeagueSection({
  label,
  games,
  selectedGameId,
  selection,
  onSelectOutcome,
}: SportsLeagueSectionProps) {
  if (games.length === 0) {
    return null;
  }

  return (
    <section className="mb-2">
      <div
        className={cn(
          'my-0 flex h-max scroll-mt-4 items-center lg:gap-3 lg:px-3',
          'max-lg:h-auto max-lg:bg-transparent max-lg:pl-0 lg:pb-1',
        )}
      >
        <h2
          className={cn(
            'mb-2 text-heading-lg font-semibold tracking-[0.25px] text-text',
            'transition-[text-decoration-color] duration-120 ease-out',
            '[font-variant-numeric:slashed-zero] max-lg:mb-1 lg:mb-0 lg:min-w-0 lg:flex-1',
          )}
        >
          {label}
        </h2>
        <div className="hidden min-[1200px]:flex min-w-[372px] flex-1 justify-end lg:w-[372px]">
          <div className="flex h-full w-full gap-2">
            {COLUMN_HEADERS.map((header) => (
              <div
                key={header}
                className="flex h-full flex-1 items-center justify-center"
              >
                <p className="text-[10px] font-semibold tracking-wide text-text-secondary uppercase">
                  {header}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {games.map((game) => (
        <div key={game.gameId} className="w-full pb-2">
          <SportsMarketRow
            game={game}
            isSelected={game.gameId === selectedGameId}
            selection={selection}
            onSelectOutcome={onSelectOutcome}
          />
        </div>
      ))}
    </section>
  );
}
