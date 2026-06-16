import Link from 'next/link';
import type { CSSProperties } from 'react';
import {
  FOOTER_BRAND_SUBTITLE,
  FOOTER_COMPANY_LINE,
  FOOTER_DISCLAIMER,
  FOOTER_LEGAL_LINKS,
  FOOTER_POLYMARKET_LINKS,
  FOOTER_SOCIAL_ICONS,
  FOOTER_SUPPORT_SOCIAL_LINKS,
  FOOTER_TOPIC_COLUMNS_DESKTOP,
  FOOTER_TOPIC_COLUMNS_MOBILE,
  MOBILE_BOTTOM_NAV_HEIGHT_PX,
  type FooterLinkItem,
} from '@/lib/constants/footer';
import {
  FooterChevronDownIcon,
  FooterGlobeIcon,
  FooterSocialIconGlyph,
} from '@/components/icons/FooterIcons';
import { cn } from '@/lib/cn';
import { Logo } from './Logo';

function FooterTopicLink({ item }: { item: FooterLinkItem }) {
  return (
    <a
      href={item.href}
      onClick={(event) => {
        if (item.href === '#') {
          event.preventDefault();
        }
      }}
      className={cn(
        'group block py-1.5',
        'text-sm leading-5 text-text',
        'transition-colors hover:text-[#77808d]',
      )}
    >
      <span className="inline-flex items-center gap-1 font-medium">
        {item.label}
        {item.showChevron ? <FooterChevronDownIcon /> : null}
      </span>
      {item.secondaryLabel ? (
        <span className="mt-0.5 block text-xs leading-4 text-[#77808d]">
          {item.secondaryLabel}
        </span>
      ) : null}
    </a>
  );
}

function FooterPlainLink({ item }: { item: FooterLinkItem }) {
  const isExternalRoute = item.href.startsWith('/') && item.href !== '#';

  const className = cn(
    'block py-1 text-sm leading-5 font-medium text-text',
    'transition-colors hover:text-[#77808d]',
  );

  if (isExternalRoute) {
    return (
      <Link href={item.href} className={className}>
        {item.label}
      </Link>
    );
  }

  return (
    <a
      href={item.href}
      onClick={(event) => {
        if (item.href === '#') {
          event.preventDefault();
        }
      }}
      className={className}
    >
      {item.label}
    </a>
  );
}

function FooterLinkColumn({
  title,
  items,
}: {
  title: string;
  items: FooterLinkItem[];
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-text">{title}</h3>
      <div className="flex flex-col">
        {items.map((item) => (
          <FooterPlainLink key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
}

function FooterTopicColumns({
  columns,
  className,
}: {
  columns: FooterLinkItem[][];
  className?: string;
}) {
  return (
    <div className={cn('grid gap-x-8', className)}>
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col">
          {column.map((item) => (
            <FooterTopicLink key={item.label} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Polymarket-style site footer with responsive topic grid and legal region.
 */
export function Footer() {
  return (
    <footer
      className="mt-auto border-t border-border bg-surface pb-[var(--mobile-bottom-nav-height)] md:pb-0"
      style={
        {
          '--mobile-bottom-nav-height': `${MOBILE_BOTTOM_NAV_HEIGHT_PX}px`,
        } as CSSProperties
      }
    >
      <div className="mx-auto max-w-[1350px] px-4 py-10 md:px-6 md:py-14">
        <div className="mb-8">
          <Logo />
          <p className="mt-2 max-w-xs text-sm leading-5 text-[#77808d]">
            {FOOTER_BRAND_SUBTITLE}
          </p>
        </div>

        <div className="mb-8 lg:mb-10">
          <h2 className="mb-4 text-sm font-semibold text-text">
            Markets by category and topics
          </h2>

          <div className="lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-10">
            <div>
              <FooterTopicColumns
                columns={FOOTER_TOPIC_COLUMNS_DESKTOP}
                className="hidden grid-cols-3 lg:grid"
              />
              <FooterTopicColumns
                columns={FOOTER_TOPIC_COLUMNS_MOBILE}
                className="grid grid-cols-2 lg:hidden"
              />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-8 lg:mt-0">
              <FooterLinkColumn
                title="Support & Social"
                items={FOOTER_SUPPORT_SOCIAL_LINKS}
              />
              <FooterLinkColumn title="Polymarket" items={FOOTER_POLYMARKET_LINKS} />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {FOOTER_SOCIAL_ICONS.map((icon) => (
                <a
                  key={icon.key}
                  href={icon.href}
                  aria-label={icon.label}
                  onClick={(event) => event.preventDefault()}
                  className={cn(
                    'inline-flex h-8 w-8 items-center justify-center rounded-md',
                    'text-text transition-colors hover:bg-surface-2',
                  )}
                >
                  <FooterSocialIconGlyph icon={icon.key} />
                </a>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs leading-4 text-[#77808d] lg:flex-1 lg:justify-center">
              <span className="whitespace-nowrap">{FOOTER_COMPANY_LINE}</span>
              {FOOTER_LEGAL_LINKS.map((item) => (
                <span key={item.label} className="inline-flex items-center">
                  <span aria-hidden className="mx-1">
                    ·
                  </span>
                  <a
                    href={item.href}
                    onClick={(event) => {
                      if (item.href === '#') {
                        event.preventDefault();
                      }
                    }}
                    className="transition-colors hover:text-text"
                  >
                    {item.label}
                  </a>
                </span>
              ))}
            </div>

            <button
              type="button"
              aria-label="Select language"
              className={cn(
                'inline-flex items-center gap-1.5 self-start rounded-md px-1 py-1',
                'text-xs font-medium text-text',
                'transition-colors hover:bg-surface-2 lg:self-auto',
              )}
            >
              <FooterGlobeIcon />
              English
              <FooterChevronDownIcon />
            </button>
          </div>

          <p className="mt-4 text-[11px] leading-4 text-[#77808d] lg:mt-5">
            {FOOTER_DISCLAIMER.split('Terms of Service & Privacy Policy.')[0]}
            <a href="#" className="underline hover:text-text">
              Terms of Service & Privacy Policy
            </a>
            .
          </p>

          <p className="mt-3 text-[10px] leading-4 text-[#77808d]/80">
            bolymarket — not affiliated with Polymarket
          </p>
        </div>
      </div>
    </footer>
  );
}
