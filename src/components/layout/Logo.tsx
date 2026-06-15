import Link from "next/link";
import { cn } from "@/lib/cn";

export interface LogoProps {
  className?: string;
}

/**
 * bolymarket wordmark lockup (~161×26).
 */
export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex h-[26px] min-w-[161px] items-center gap-2",
        "text-base leading-5 font-bold text-text",
        className,
      )}
    >
      <span
        aria-hidden
        className="flex h-5 w-5 items-center justify-center rounded-sm bg-brand text-[10px] font-bold text-white"
      >
        B
      </span>
      <span>bolymarket</span>
    </Link>
  );
}
