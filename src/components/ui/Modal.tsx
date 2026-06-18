"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
}

/**
 * Accessible modal dialog with motion transitions.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  hideHeader = false,
}: ModalProps) {
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-250 flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-black/40"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby={hideHeader ? "modal-description" : undefined}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            className={cn(
              "relative z-10 w-full max-w-md rounded-card border border-border bg-background p-6 shadow-lg outline-none",
              className,
            )}
          >
            {hideHeader ? (
              <span className="sr-only">
                <h2 id="modal-title">{title}</h2>
                <p id="modal-description">{title}</p>
              </span>
            ) : (
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-text"
                >
                  {title}
                </h2>
                <IconButton label="Close" onClick={onClose}>
                  <X className="h-4 w-4" aria-hidden />
                </IconButton>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

export interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  mode: "login" | "signup";
}

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className="relative size-4 fill-white text-white"
      aria-hidden
    >
      <g fill="currentColor">
        <path d="M29.44 16.318c0-.993-.089-1.947-.255-2.864H16v5.422h7.535c-.331 1.744-1.324 3.22-2.813 4.213v3.525h4.544c2.647-2.444 4.175-6.033 4.175-10.296Z" />
        <path d="M16 30c3.78 0 6.949-1.247 9.265-3.385l-4.544-3.525c-1.247.84-2.838 1.349-4.722 1.349-3.64 0-6.733-2.456-7.84-5.765l-2.717 2.09-1.941 1.525c2.304 4.569 7.025 7.713 12.498 7.713Z" />
        <path d="M8.16 18.66c-.28-.84-.445-1.731-.445-2.66s.165-1.82.445-2.66V9.725H3.502C2.547 11.609 2 13.734 2 16s.547 4.391 1.502 6.275h3.332z" />
        <path d="M16 7.575c2.062 0 3.895.713 5.358 2.087l4.009-4.009C22.936 3.388 19.78 2 16 2 10.527 2 5.805 5.144 3.502 9.725L8.16 13.34c1.107-3.309 4.2-5.765 7.84-5.765" />
      </g>
    </svg>
  );
}

const AUTH_METHODS = [
  { label: "Continue with Telegram", icon: "telegram" },
  { label: "Continue with Steam", icon: "steam" },
  { label: "Continue with MetaMask", icon: "metamask" },
  { label: "Continue with Coinbase", icon: "coinbase" },
  { label: "Continue with Rabby", icon: "rabby" },
  { label: "Continue with Phantom", icon: "phantom" },
  { label: "Continue with wallet connect", icon: "walletconnect" },
] as const;

type AuthMethodIconName = (typeof AUTH_METHODS)[number]["icon"];

function AuthMethodIcon({ icon }: { icon: AuthMethodIconName }) {
  switch (icon) {
    case "telegram":
      return (
        <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
          <rect width="32" height="32" rx="9" fill="#229ED9" />
          <path
            fill="#fff"
            d="m22.94 8.76-2.64 13.27c-.2.88-.72 1.1-1.46.68l-4.03-2.97-1.94 1.87c-.22.22-.4.4-.8.4l.28-4.08 7.43-6.71c.32-.29-.07-.45-.5-.16l-9.18 5.78-3.96-1.24c-.86-.27-.88-.86.18-1.27l15.5-5.98c.72-.27 1.35.16 1.12 1.28Z"
          />
        </svg>
      );
    case "steam":
      return (
        <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
          <rect width="32" height="32" rx="9" fill="#1b2838" />
          <path
            fill="#fff"
            d="M15.98 4C9.68 4 4.51 8.86 4.02 15.04l6.43 2.66a3.4 3.4 0 0 1 1.91-.6h.2l2.86-4.13v-.06a4.52 4.52 0 1 1 4.42 4.53l-4.08 2.91v.16a3.39 3.39 0 0 1-6.72.67L4.44 19.27C5.86 24.31 10.49 28 15.98 28c6.63 0 12-5.37 12-12s-5.37-12-12-12Zm-4.44 18.21-1.47-.61a2.55 2.55 0 1 0 1.4-3.49l1.52.63a1.88 1.88 0 1 1-1.45 3.47Zm11.42-9.3a3.02 3.02 0 1 0-6.04 0 3.02 3.02 0 0 0 6.04 0Zm-5.28-.01a2.27 2.27 0 1 1 4.54 0 2.27 2.27 0 0 1-4.54 0Z"
          />
        </svg>
      );
    case "metamask":
      return (
        <div className="flex size-8 items-center justify-center rounded-[27%] bg-[#FF5C16]">
          <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
            <path
              fill="#fff"
              d="M28 5.5 18.7 12l1.7-4.1L28 5.5ZM4 5.5 13.2 12l-1.6-4.1L4 5.5Zm20.7 16-2.5 3.8 5.3 1.5 1.5-5.2h-4.3ZM3 21.6l1.5 5.2 5.3-1.5-2.5-3.8H3Zm6.5-6.4-1.5 2.3 5.2.2-.2-5.6-3.5 3.1Zm13 0-3.6-3.2-.1 5.7 5.2-.2-1.5-2.3Zm-12.7 10 3.2-1.6-2.8-2.2-.4 3.8Zm9.2-1.6 3.2 1.6-.4-3.8-2.8 2.2Zm3.2-6.1-5.1.2.5 2.5 1.4 3.4 2.8-2.2.4-3.9Zm-12.4 0 .4 3.9 2.8 2.2 1.4-3.4.5-2.5-5.1-.2Z"
            />
          </svg>
        </div>
      );
    case "coinbase":
      return (
        <svg viewBox="0 0 20 20" className="size-8 rounded-[27%]" aria-hidden>
          <rect width="20" height="20" rx="5.4" fill="#0052FF" />
          <path
            fill="#fff"
            fillRule="evenodd"
            d="M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM8.25 7.71a.54.54 0 0 0-.54.54v3.5c0 .3.24.54.54.54h3.5c.3 0 .54-.24.54-.54v-3.5a.54.54 0 0 0-.54-.54h-3.5Z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "rabby":
      return (
        <div className="flex size-8 items-center justify-center rounded-[27%] bg-[#8697FF] text-white">
          <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
            <path
              fill="currentColor"
              d="M27.7 17.5c1.1-2.1-3.4-8-8-10.4-2.9-1.9-5.9-1.6-6.5-.8-1.3 1.8 4.4 3.4 8.2 5.2-1 .4-1.9 1.2-2.4 2.2-1.4-1.5-4.6-2.8-8.2-1.8-2.5.7-4.6 2.4-5.4 5-.2-.1-.4-.1-.6-.1a1.55 1.55 0 0 0 0 3.1c.2 0 .7-.1.7-.1h8c-3.2 5-5.7 5.8-5.7 6.6s2.4.6 3.3.3c4.3-1.6 9-6.4 9.8-7.8 3.4.4 6.2.5 6.8-1.4Z"
            />
          </svg>
        </div>
      );
    case "phantom":
      return (
        <div className="flex size-8 items-center justify-center rounded-[27.5%] bg-[#AB9FF2] text-white">
          <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
            <path
              fill="currentColor"
              d="M13.7 20.7C12 23 9.2 26 5.6 26 3.9 26 2.3 25.3 2.3 22.4 2.3 15 12.8 3.5 22.5 3.5 28 3.5 30.2 7.2 30.2 11.4c0 5.4-3.6 11.6-7.2 11.6-1.1 0-1.7-.6-1.7-1.6 0-.3 0-.5.1-.8-1.2 2-3.6 3.9-5.8 3.9-1.6 0-2.4-1-2.4-2.4 0-.5.1-1 .3-1.5Zm7.2-11.4c-.9 0-1.5.7-1.5 1.8s.6 1.8 1.5 1.8 1.5-.8 1.5-1.8-.6-1.8-1.5-1.8Zm4.7 0c-.9 0-1.5.7-1.5 1.8s.6 1.8 1.5 1.8 1.5-.8 1.5-1.8-.6-1.8-1.5-1.8Z"
            />
          </svg>
        </div>
      );
    case "walletconnect":
      return (
        <div className="flex size-8 items-center justify-center rounded-[27.5%] bg-black text-white">
          <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
            <rect x="6" y="6" width="8" height="8" rx="1.5" fill="currentColor" />
            <rect x="18" y="6" width="8" height="8" rx="1.5" fill="currentColor" />
            <rect x="12" y="18" width="8" height="8" rx="1.5" fill="currentColor" />
          </svg>
        </div>
      );
  }
}

/**
 * Visual-only auth modal (no real authentication).
 */
export function AuthModal({ open, onClose, mode }: AuthModalProps) {
  const title = mode === "login" ? "Authentication" : "Authentication";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      hideHeader
      className="max-w-md overflow-hidden rounded-3xl border bg-background p-6 shadow-lg outline-none"
    >
      <div className="flex flex-col">
        <div className="flex w-full flex-col items-center gap-[18px]">
          <div className="flex flex-col items-center">
            <p className="text-xl font-semibold">Welcome to Bolymarket</p>
          </div>

          <button
            type="button"
            className={cn(
              "inline-flex cursor-pointer items-center whitespace-nowrap rounded-sm text-body-base",
              "font-semibold transition duration-150 active:scale-[97%] focus-visible:ring-1",
              "focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none",
              "disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
              "h-[52px] w-full justify-center gap-2.5 bg-button-primary-bg px-4 py-2",
              "text-button-primary-text hover:bg-button-primary-bg-hover",
            )}
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          <div className="my-1 flex w-full items-center justify-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm font-medium text-text-secondary">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form
            noValidate
            className={cn(
              "relative h-14 w-full overflow-hidden rounded-lg border border-[#E6E8EA]",
              "transition-colors focus-within:ring-2 focus-within:ring-brand-500/70",
            )}
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              id="magic-email-input"
              placeholder="Email address"
              type="email"
              name="email"
              className={cn(
                "flex h-full w-full rounded-md border border-[#E6E8EA] bg-transparent px-3 py-1",
                "pr-[110px] text-sm text-text transition-shadow duration-200",
                "placeholder:text-text-tertiary autofill:bg-transparent! file:border-0",
                "file:bg-transparent file:text-sm file:font-medium",
                "focus-visible:bg-transparent focus-visible:outline-none disabled:cursor-not-allowed",
                "disabled:opacity-50",
                "border-0! rounded-none! hover:bg-transparent! focus-visible:ring-0!",
              )}
            />
            <div className="absolute right-2 top-1/2 z-10 w-full max-w-[90px] -translate-y-1/2">
              <button
                className={cn(
                  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap",
                  "rounded-sm text-body-base transition duration-150 active:scale-[97%]",
                  "focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
                  "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none",
                  "[&_svg]:shrink-0 h-9 w-full bg-button-primary-bg px-4 py-2 text-sm",
                  "font-medium text-button-primary-text hover:bg-button-primary-bg-hover",
                )}
                type="submit"
                disabled
              >
                Continue
              </button>
            </div>
          </form>

          <div className="flex w-full flex-col items-center gap-[18px]">
            <div className="grid w-full flex-1 grid-cols-4 gap-[18px]">
              {AUTH_METHODS.map((method) => (
                <button
                  key={method.label}
                  type="button"
                  aria-label={method.label}
                  className={cn(
                    "inline-flex h-14 w-full cursor-pointer items-center justify-center gap-2",
                    "whitespace-nowrap rounded-sm border border-[#E6E8EA] p-2",
                    "text-body-base font-semibold text-button-outline-text transition duration-150",
                    "active:scale-[97%] hover:bg-neutral-25 focus-visible:ring-1",
                    "focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none",
                    "disabled:cursor-default disabled:opacity-50",
                  )}
                >
                  <AuthMethodIcon icon={method.icon} />
                </button>
              ))}
              <button
                type="button"
                aria-label="More methods"
                aria-expanded="false"
                className={cn(
                  "group inline-flex h-14 w-full cursor-pointer items-center justify-center gap-2",
                  "whitespace-nowrap rounded-sm border border-[#E6E8EA] p-2",
                  "text-body-base font-semibold text-text-secondary transition duration-150",
                  "active:scale-[97%] hover:bg-neutral-25 focus-visible:ring-1",
                  "focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none",
                )}
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-button-ghost-bg transition-colors duration-200 group-hover:text-text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    className="size-5"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      fill="currentColor"
                      d="M4.25 8.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5m5.75 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5m5.75 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          <div className="flex w-full items-center justify-center gap-1.5">
            <a
              href="/tos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-text-secondary transition-colors duration-200 hover:text-text-tertiary"
            >
              Terms
            </a>
            <span className="select-none text-xs text-text-secondary">•</span>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-text-secondary transition-colors duration-200 hover:text-text-tertiary"
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export interface HowItWorksModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Informational modal explaining prediction markets.
 */
export function HowItWorksModal({ open, onClose }: HowItWorksModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="How it works">
      <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
        <li>Browse markets and see live probabilities.</li>
        <li>Buy shares on outcomes you think will happen.</li>
        <li>Prices move as traders react to new information.</li>
        <li>Winning shares pay out $1 when the market resolves.</li>
      </ol>
    </Modal>
  );
}
