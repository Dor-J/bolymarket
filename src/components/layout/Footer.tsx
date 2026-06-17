import Link from 'next/link';
import {
  FOOTER_AFFILIATION_LINE,
  FOOTER_BRAND_SUBTITLE,
  FOOTER_COMPANY_LINE,
  FOOTER_LEGAL_LINKS,
  FOOTER_POLYMARKET_LINKS,
  FOOTER_SOCIAL_ICONS,
  FOOTER_SUPPORT_SOCIAL_LINKS,
  FOOTER_TOPIC_LINKS,
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
      className="text-sm font-medium text-text transition-colors hover:text-text-secondary"
    >
      {item.label}
      {item.secondaryLabel ? (
        <span className="block text-xs text-text-tertiary">{item.secondaryLabel}</span>
      ) : null}
    </a>
  );
}

function FooterPlainLink({ item }: { item: FooterLinkItem }) {
  const isInternalRoute = item.href.startsWith('/') && item.href !== '#';

  const className =
    'text-sm font-medium text-text transition-colors hover:text-text-secondary';

  if (isInternalRoute) {
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
    <div className="flex flex-col">
      <h3 className="mb-3 text-sm font-medium text-text-secondary">{title}</h3>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <FooterPlainLink key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
}

function FooterLegalLink({ item }: { item: FooterLinkItem }) {
  const className =
    'text-sm font-medium text-text-secondary transition-colors hover:text-text-tertiary';

  if (item.href.startsWith('/') && item.href !== '#') {
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

/**
 * Polymarket-style site footer with responsive topic grid and legal region.
 */
export function Footer() {
  return (
    <footer className="mt-auto w-full bg-background pb-20 lg:pb-0">
      <div className="mx-auto w-full max-w-[1350px] px-4 py-12 lg:px-6 lg:py-16">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col items-start gap-2">
            <Logo variant="footer" />
            <p className="text-base font-medium text-text">{FOOTER_BRAND_SUBTITLE}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:grid-cols-[1fr_auto_auto] lg:gap-16">
            <div className="col-span-2 flex flex-col lg:col-span-1">
              <h3 className="mb-3 text-sm font-medium text-text-secondary">
                Markets by category and topics
              </h3>
              <div className="grid grid-cols-2 gap-x-12 gap-y-3 lg:grid-cols-3">
                {FOOTER_TOPIC_LINKS.map((item) => (
                  <FooterTopicLink key={item.label} item={item} />
                ))}
                <button
                  type="button"
                  className={cn(
                    'flex cursor-pointer items-center gap-1 self-start',
                    'text-sm font-medium text-text-secondary transition-colors',
                    'hover:text-text-tertiary',
                  )}
                >
                  <span>View more</span>
                  <FooterChevronDownIcon />
                </button>
              </div>
            </div>

            <FooterLinkColumn
              title="Support & Social"
              items={FOOTER_SUPPORT_SOCIAL_LINKS}
            />
            <FooterLinkColumn title="Polymarket" items={FOOTER_POLYMARKET_LINKS} />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                {FOOTER_SOCIAL_ICONS.map((icon) => (
                  <a
                    key={icon.key}
                    href={icon.href}
                    aria-label={icon.label}
                    onClick={(event) => event.preventDefault()}
                    className="text-text transition-colors hover:text-text-secondary"
                  >
                    <FooterSocialIconGlyph icon={icon.key} />
                  </a>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-text-secondary">
                <span className="text-text">{FOOTER_COMPANY_LINE}</span>
                {FOOTER_LEGAL_LINKS.map((item) => (
                  <span key={item.label} className="contents">
                    <span className="text-text-tertiary" aria-hidden>
                      ·
                    </span>
                    <FooterLegalLink item={item} />
                  </span>
                ))}
              </div>

              <button
                type="button"
                aria-label="Select language"
                className={cn(
                  'flex cursor-pointer items-center gap-1.5',
                  'text-sm font-medium text-text transition-colors',
                  'hover:text-text-secondary focus:outline-none',
                )}
              >
                <FooterGlobeIcon />
                <span>English</span>
                <FooterChevronDownIcon />
              </button>
            </div>

            <p className="text-xs leading-relaxed text-text-tertiary">
              Polymarket operates globally through separate legal entities.{' '}
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="underline transition-colors hover:text-text-secondary"
              >
                Polymarket US
              </a>{' '}
              is operated by QCX LLC d/b/a Polymarket US, a CFTC-regulated Designated
              Contract Market. This international platform is not regulated by the CFTC and
              operates independently. Trading involves substantial risk of loss. See our{' '}
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="underline transition-colors hover:text-text-secondary"
              >
                Terms of Service
              </a>{' '}
              &amp;{' '}
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="underline transition-colors hover:text-text-secondary"
              >
                Privacy Policy
              </a>
              .
            </p>

            <p className="text-xs leading-relaxed text-text-tertiary">
              {FOOTER_AFFILIATION_LINE}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
