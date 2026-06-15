"use client";

import { Code2, Share2 } from "lucide-react";
import type { Event } from "@/types/polymarket";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { IconButton } from "@/components/ui/IconButton";
import { MarketThumbnail } from "@/components/market/MarketThumbnail";
import { formatBreadcrumb } from "@/lib/event/formatBreadcrumb";

export interface EventHeaderProps {
  event: Event;
}

/**
 * Event detail header with breadcrumb, title, and action icons (§16.1).
 */
export function EventHeader({ event }: EventHeaderProps) {
  const breadcrumb = formatBreadcrumb(event);

  return (
    <header className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        {breadcrumb ? (
          <p className="text-xs leading-4 text-muted">{breadcrumb}</p>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-1">
          <IconButton label="Embed event">
            <Code2 className="h-4 w-4" aria-hidden />
          </IconButton>
          <IconButton label="Share event">
            <Share2 className="h-4 w-4" aria-hidden />
          </IconButton>
          <BookmarkButton />
        </div>
      </div>

      <div className="flex items-start gap-3">
        <MarketThumbnail title={event.title} image={event.image} size={48} />
        <h1 className="min-w-0 text-2xl leading-7 font-semibold text-text">
          {event.title}
        </h1>
      </div>
    </header>
  );
}
