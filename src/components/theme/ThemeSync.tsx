"use client";

import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { themeAtom } from "@/lib/atoms/theme";

/**
 * Syncs the Jotai theme atom to the `data-theme` attribute on `<html>`.
 */
export function ThemeSync() {
  const theme = useAtomValue(themeAtom);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return null;
}
