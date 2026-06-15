'use client';

import { Code2, Share2 } from 'lucide-react';
import { useState } from 'react';
import type { Event } from '@/types/polymarket';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { IconButton } from '@/components/ui/IconButton';
import { MarketThumbnail } from '@/components/market/MarketThumbnail';
import { formatBreadcrumb } from '@/lib/event/formatBreadcrumb';
import {
  buildEmbedSnippet,
  copyToClipboard,
  shareEvent,
} from '@/lib/share/shareEvent';

export interface EventHeaderProps {
  event: Event;
}

/**
 * Event detail header with breadcrumb, title, and action icons (§16.1).
 */
export function EventHeader({ event }: EventHeaderProps) {
  const breadcrumb = formatBreadcrumb(event);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

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
    <header className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        {breadcrumb ? (
          <p className="text-xs leading-4 text-muted">{breadcrumb}</p>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-1">
          <div className="relative">
            <IconButton
              label="Embed event"
              onClick={() => {
                setEmbedOpen((open) => !open);
              }}
            >
              <Code2 className="h-4 w-4" aria-hidden />
            </IconButton>
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
          </div>
          <IconButton label="Share event" onClick={() => void handleShare()}>
            <Share2 className="h-4 w-4" aria-hidden />
          </IconButton>
          <BookmarkButton slug={event.slug} />
        </div>
      </div>

      {shareStatus ? (
        <p className="text-right text-xs font-medium text-brand" aria-live="polite">
          {shareStatus}
        </p>
      ) : null}

      <div className="flex items-start gap-3">
        <MarketThumbnail title={event.title} image={event.image} size={48} />
        <h1 className="min-w-0 text-2xl leading-7 font-semibold text-text">
          {event.title}
        </h1>
      </div>
    </header>
  );
}
