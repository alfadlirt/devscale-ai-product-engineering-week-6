import { z } from "zod";

export const ReviewerSchema = z.object({
  isOptimized: z.boolean(),
  isMeetingPreferences: z.boolean(),
  score: z.number().describe("A score between 0 and 100, 100 being the best"),
  suggestions: z
    .array(z.string())
    .describe("Suggestions to improve the itinerary"),
});

export const ReviewerResultSchema = z.object({
  reviewer: z.array(ReviewerSchema),
});

export type ReviewerResult = z.infer<typeof ReviewerResultSchema>;
