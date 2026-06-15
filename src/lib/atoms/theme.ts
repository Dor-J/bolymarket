import { atom } from "jotai";
import type { Theme } from "@/types/polymarket";

/** Application theme — synced to `data-theme` on `<html>`. */
export const themeAtom = atom<Theme>("light");
