import { z } from "zod";

/** Parses Gamma's double-encoded JSON string arrays or native arrays. */
const jsonStringArraySchema = z.union([
  z.array(z.string()),
  z.string().transform((value, ctx) => {
    try {
      const parsed: unknown = JSON.parse(value);
      if (
        !Array.isArray(parsed) ||
        !parsed.every((item) => typeof item === "string")
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Expected a JSON string array",
        });
        return z.NEVER;
      }
      return parsed;
    } catch {
      ctx.addIssue({ code: "custom", message: "Invalid JSON string array" });
      return z.NEVER;
    }
  }),
]);

const gammaTagSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    label: z.string().optional(),
    slug: z.string().optional(),
  })
  .passthrough();

/** Permissive raw market shape from the Gamma API. */
export const gammaMarketSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    question: z.string().optional(),
    slug: z.string().optional(),
    image: z.string().optional(),
    icon: z.string().optional(),
    volume: z.union([z.string(), z.number()]).optional(),
    volumeNum: z.number().optional(),
    outcomes: jsonStringArraySchema.optional(),
    outcomePrices: jsonStringArraySchema.optional(),
    clobTokenIds: jsonStringArraySchema.optional(),
    endDate: z.string().optional(),
    endDateIso: z.string().optional(),
    active: z.boolean().optional(),
    closed: z.boolean().optional(),
    sportsMarketType: z.string().optional(),
    line: z.union([z.string(), z.number()]).optional(),
    gameId: z.union([z.string(), z.number()]).optional(),
    gameStartTime: z.string().optional(),
    teamAID: z.union([z.string(), z.number()]).optional(),
    teamBID: z.union([z.string(), z.number()]).optional(),
    shortOutcomes: jsonStringArraySchema.optional(),
    score: z.union([z.string(), z.number()]).optional(),
    gameStatus: z.string().optional(),
  })
  .passthrough();

const gammaTeamSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    name: z.string().optional(),
    league: z.string().optional(),
    record: z.string().optional(),
    logo: z.string().optional(),
    abbreviation: z.string().optional(),
    alias: z.string().optional(),
    color: z.string().optional(),
  })
  .passthrough();

export const gammaTeamsResponseSchema = z.array(gammaTeamSchema);

export const gammaSportsMetadataSchema = z.array(
  z
    .object({
      sport: z.string(),
      image: z.string().optional(),
      resolution: z.string().optional(),
      ordering: z.string().optional(),
      tags: z.string().optional(),
      series: z.string().optional(),
    })
    .passthrough(),
);

/** Permissive raw event shape from the Gamma API. */
export const gammaEventSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    slug: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    icon: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(gammaTagSchema).optional(),
    volume: z.union([z.string(), z.number()]).optional(),
    volume24hr: z.union([z.string(), z.number()]).optional(),
    endDate: z.string().optional(),
    endDateIso: z.string().optional(),
    markets: z.array(gammaMarketSchema).optional(),
    active: z.boolean().optional(),
    closed: z.boolean().optional(),
    gameStatus: z.string().optional(),
    spreadsMainLine: z.union([z.string(), z.number()]).optional(),
    totalsMainLine: z.union([z.string(), z.number()]).optional(),
  })
  .passthrough();

/** Gamma `/events` endpoint response. */
export const gammaEventsResponseSchema = z.array(gammaEventSchema);

export type GammaEvent = z.infer<typeof gammaEventSchema>;
export type GammaMarket = z.infer<typeof gammaMarketSchema>;
export type GammaTeam = z.infer<typeof gammaTeamSchema>;
