import { z } from "zod";

export const PreferenceSchema = z.object({
  destination: z.string(),
  interests: z.array(z.string()),
  days: z.number(),
  budget: z.string(),
});

export const PreferenceResultSchema = z.object({
  preferences: z.array(PreferenceSchema),
});

export type PreferenceResult = z.infer<typeof PreferenceResultSchema>;
