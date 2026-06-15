import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "ghost-brand" | "brand";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  "ghost-brand":
    "bg-transparent text-brand hover:bg-black/5 dark:hover:bg-white/10",
  brand: "bg-brand text-white hover:bg-[var(--brand-600)]",
};

/**
 * Shared button primitive for shell actions.
 */
export function Button({
  className,
  variant = "ghost-brand",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-9 shrink-0 items-center justify-center rounded-sm px-4",
        "text-sm leading-5 font-semibold transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
