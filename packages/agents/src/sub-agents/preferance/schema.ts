import { z } from "zod";

export const PreferenceSchema = z.object({
  isComplete: z
    .boolean()
    .describe(
      "True only when destination, interests, days, and budget are all known from the user.",
    ),
  destination: z
    .string()
    .describe("Destination name, or empty string if unknown."),
  interests: z
    .array(z.string())
    .describe("Travel interests; empty array if unknown."),
  days: z
    .number()
    .nullable()
    .describe("Number of travel days, or null if unknown."),
  budget: z
    .string()
    .describe("Budget description (e.g. amount or range), or empty string if unknown."),
  missingFields: z
    .array(z.string())
    .describe(
      "Field names still needed from the user, e.g. destination, interests, days, budget.",
    ),
  clarifyingQuestions: z
    .array(z.string())
    .describe(
      "Questions the main agent should ask the user when isComplete is false.",
    ),
});

export type Preference = z.infer<typeof PreferenceSchema>;
