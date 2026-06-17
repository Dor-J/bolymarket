import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ChipVariant = "yes" | "no";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ChipVariant;
  fullWidth?: boolean;
}

const variantClasses: Record<ChipVariant, string> = {
  yes: "bg-yes/15 text-yes hover:bg-yes hover:text-white",
  no: "bg-no/10 text-no hover:bg-no hover:text-white",
};

/**
 * Shared Yes/No chip primitive for market cards.
 */
export function Chip({
  variant,
  fullWidth = false,
  className,
  type = "button",
  ...props
}: ChipProps) {
  return (
    <button
      type={type}
      className={cn(
        "group relative inline-flex h-[27px] shrink-0 items-center justify-center overflow-hidden rounded-[5.2px] px-3.5",
        "text-[13px] leading-4 font-w490 transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        fullWidth ? "flex-1" : "w-10",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
