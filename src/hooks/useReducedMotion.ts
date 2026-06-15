"use client";

import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const listeners = new Set<() => void>();
let mediaQuery: MediaQueryList | null = null;

function ensureSharedMediaQueryListener(): void {
  if (typeof window === "undefined" || mediaQuery) {
    return;
  }

  mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", () => {
    for (const listener of listeners) {
      listener();
    }
  });
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

function subscribeToReducedMotion(onStoreChange: () => void): () => void {
  ensureSharedMediaQueryListener();
  listeners.add(onStoreChange);

  return () => {
    listeners.delete(onStoreChange);
  };
}

/**
 * Returns whether the user prefers reduced motion.
 * Uses one shared media-query listener for the whole app.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

/** Resets shared listener state — for unit tests only. */
export function resetReducedMotionListenerForTests(): void {
  listeners.clear();
  mediaQuery = null;
}
