'use client';

import { Code2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { Event } from '@/types/polymarket';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { MarketThumbnail } from '@/components/market/MarketThumbnail';
import {
  buildEmbedSnippet,
  copyToClipboard,
  shareEvent,
} from '@/lib/share/shareEvent';
import { cn } from '@/lib/cn';

export interface EventHeaderProps {
  event: Event;
}

function capitalizeLabel(value: string): string {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function categoryHref(category: string): string {
  const slug = category.toLowerCase();

  if (slug === 'sports') {
    return '/sports/live';
  }

  return `/${slug}`;
}

function tagHref(tag: string): string {
  return `/predictions/${tag.toLowerCase().replace(/\s+/g, '-')}`;
}

function ChainLinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        d="M8.37 6.89a3.5 3.5 0 0 0-.84.62l-.01.02a3.53 3.53 0 0 0 0 5l2.17 2.17a3.53 3.53 0 0 0 5 0l.01-.01a3.53 3.53 0 0 0 0-5l-.76-.76"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M9.63 11.11c.3-.16.59-.37.84-.62l.01-.02a3.53 3.53 0 0 0 0-5L8.31 3.3a3.53 3.53 0 0 0-5 0l-.01.01a3.53 3.53 0 0 0 0 5l.76.76"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

const actionButtonClass = cn(
  'inline-flex size-9 cursor-pointer items-center justify-center rounded-full',
  'bg-button-ghost-bg text-button-ghost-text transition duration-150 active:scale-[97%]',
  'hover:bg-button-ghost-bg-hover focus-visible:ring-1 focus-visible:ring-ring',
  'focus-visible:outline-none [&_svg]:pointer-events-none [&_svg]:shrink-0',
);

/**
 * Event detail header with breadcrumb, title, and action icons (§16.1).
 */
export function EventHeader({ event }: EventHeaderProps) {
  const [embedOpen, setEmbedOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const category = event.category;
  const tag = event.tags[0];

  const eventUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/event/${event.slug}`
      : `/event/${event.slug}`;

  async function handleShare() {
    const result = await shareEvent({ title: event.title, url: eventUrl });
    if (result === 'shared') {
      setShareStatus('Shared');
    } else if (result === 'copied') {
      setShareStatus('Link copied');
    } else {
      setShareStatus('Share failed');
    }

    window.setTimeout(() => setShareStatus(null), 2000);
  }

  async function handleEmbedCopy() {
    const snippet = buildEmbedSnippet(eventUrl);
    const copied = await copyToClipboard(snippet);
    setShareStatus(copied ? 'Embed code copied' : 'Copy failed');
    window.setTimeout(() => setShareStatus(null), 2000);
  }

  return (
    <header className="sticky top-[116px] z-20 mb-2 flex w-full flex-col justify-center bg-background py-1">
      <div className="pointer-events-none absolute top-0 left-full h-[72px] w-3 bg-background" />
      <div className="pointer-events-none absolute top-0 right-full h-[72px] w-3 bg-background" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-border opacity-0" />

      <div className="relative flex w-full items-center justify-between gap-4">
        <div className="flex w-full min-w-0 items-center gap-4">
          <div className="shrink-0 overflow-hidden rounded-sm">
            <MarketThumbnail
              title={event.title}
              image={event.image}
              size={64}
              className="rounded-sm"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
            <div className="overflow-hidden transition-[max-height,opacity] duration-200 ease-out">
              <div className="relative z-10 flex items-center gap-1 text-sm text-text-secondary">
                {category ? (
                  <Link
                    href={categoryHref(category)}
                    className="font-[540] hover:text-text-tertiary"
                  >
                    {capitalizeLabel(category)}
                  </Link>
                ) : null}
                {category && tag ? <span>·</span> : null}
                {tag ? (
                  <Link
                    href={tagHref(tag)}
                    className="font-[540] hover:text-text-tertiary"
                  >
                    {capitalizeLabel(tag)}
                  </Link>
                ) : null}
              </div>
            </div>

            <h1 className="min-w-0 text-heading-2xl font-semibold text-pretty text-text">
              {event.title}
            </h1>
          </div>
        </div>

        <div className="ml-4 flex shrink-0 items-center gap-3">
          <div className="relative flex items-center gap-1">
            <button
              type="button"
              aria-label="Embed event"
              className={actionButtonClass}
              onClick={() => {
                setEmbedOpen((open) => !open);
              }}
            >
              <Code2 className="size-[18px]" aria-hidden />
            </button>
            {embedOpen ? (
              <div className="absolute top-full right-0 z-20 mt-2 w-72 rounded-md border border-border bg-card p-3 shadow-lg">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Embed code
                </p>
                <code className="block overflow-x-auto rounded bg-surface-2 p-2 text-xs text-text">
                  {buildEmbedSnippet(eventUrl)}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    void handleEmbedCopy();
                  }}
                  className="mt-2 text-xs font-semibold text-brand hover:underline"
                >
                  Copy embed code
                </button>
              </div>
            ) : null}

            <button
              type="button"
              aria-label="Copy event link"
              className={actionButtonClass}
              onClick={() => void handleShare()}
            >
              <ChainLinkIcon />
            </button>
            <BookmarkButton slug={event.slug} className={actionButtonClass} />
          </div>
        </div>
      </div>

      {shareStatus ? (
        <p className="text-right text-xs font-medium text-brand" aria-live="polite">
          {shareStatus}
        </p>
      ) : null}
    </header>
  );
}
