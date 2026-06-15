import Link from 'next/link';
import { Logo } from './Logo';

/**
 * Site footer matching Polymarket-style chrome.
 */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto flex max-w-[1350px] flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            A Polymarket-style prediction market UI for the PLAEE frontend
            assignment. Read-only — no real trading.
          </p>
        </div>

        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground"
        >
          <Link href="/" className="hover:text-text">
            Markets
          </Link>
          <Link href="/crypto" className="hover:text-text">
            Crypto
          </Link>
          <Link href="/sports" className="hover:text-text">
            Sports
          </Link>
          <Link href="/politics" className="hover:text-text">
            Politics
          </Link>
          <Link href="/api-docs" className="hover:text-text">
            API Docs
          </Link>
        </nav>
      </div>

      <div className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} bolymarket — not affiliated with Polymarket
      </div>
    </footer>
  );
}
