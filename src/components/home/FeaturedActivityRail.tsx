'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import Link from 'next/link';
import { tradeActivityByEventAtom } from '@/lib/atoms/tradeActivity';
import { relatedNewsQueryOptions } from '@/lib/api/queries';
import { formatTradeActivityLine } from '@/lib/featured/formatTradeActivity';
import type { Event } from '@/types/polymarket';
import { cn } from '@/lib/cn';

export interface FeaturedActivityRailProps {
  event: Event;
  className?: string;
}

interface ActivityItem {
  id: string;
  kind: 'news' | 'trade';
  title: string;
  body: string;
  href?: string;
}

/**
 * Related headlines and live trade tape for the featured event preview.
 */
export function FeaturedActivityRail({
  event,
  className,
}: FeaturedActivityRailProps) {
  const tradesByEvent = useAtomValue(tradeActivityByEventAtom);
  const trades = tradesByEvent[event.slug] ?? [];

  const { data: news = [], isLoading } = useQuery(
    relatedNewsQueryOptions({
      slug: event.slug,
      title: event.title,
      category: event.category,
      tags: event.tags,
      marketQuestions: event.markets.map((market) => market.question),
    }),
  );

  const activityItems = useMemo<ActivityItem[]>(() => {
    const newsItems: ActivityItem[] = news.map((article) => ({
      id: article.link,
      kind: 'news',
      title: article.source ?? 'News',
      body: article.title,
      href: article.link,
    }));

    if (newsItems.length > 0) {
      return newsItems.slice(0, 8);
    }

    if (isLoading) {
      return [];
    }

    return trades.map((trade) => {
      const formatted = formatTradeActivityLine(trade);

      return {
        id: trade.id,
        kind: 'trade',
        title: formatted.title,
        body: formatted.body,
      };
    }).slice(0, 8);
  }, [isLoading, news, trades]);

  return (
    <div
      className={cn(
        'hidden min-h-0 flex-1 overflow-hidden lg:flex lg:flex-col',
        className,
      )}
    >
      <div
        className="h-full overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(transparent 0px, black 40px, black 100%)',
        }}
      >
        <div className="flex flex-col">
          {isLoading && activityItems.length === 0 ? (
            <p className="py-2 text-sm text-text-secondary">
              Loading related activity...
            </p>
          ) : null}

          {!isLoading && activityItems.length === 0 ? (
            <p className="py-2 text-sm text-text-secondary">
              No related headlines or live trades yet.
            </p>
          ) : null}

          {activityItems.map((item) => (
            <div key={`${item.kind}-${item.id}`} className="block shrink-0 py-2">
              {item.kind === 'news' && item.href ? (
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-1.5"
                >
                  <div className="min-w-0 flex flex-col gap-0.5">
                    <p className="text-sm font-normal text-text">{item.title}</p>
                    <p className="line-clamp-2 text-xs text-text-secondary group-hover:underline">
                      {item.body}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-start gap-1.5">
                  <div className="min-w-0 flex flex-col gap-0.5">
                    <p className="text-sm font-normal text-text">{item.title}</p>
                    <p className="line-clamp-2 text-xs text-text-secondary">
                      {item.body}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
