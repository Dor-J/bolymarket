import { atom } from "jotai";
import type { CategoryFilter } from "@/types/polymarket";

/** Currently selected category for client-side event filtering. */
export const selectedCategoryAtom = atom<CategoryFilter>("trending");
