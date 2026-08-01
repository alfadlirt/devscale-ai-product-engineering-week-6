import { z } from "zod";

export const ScheduleActivitySchema = z.object({
  startTime: z.string().describe("HH:mm format"),
  endTime: z.string().describe("HH:mm format"),
  placeName: z.string(),
  category: z.string(),
  description: z.string(),
  durationMinutes: z.number(),
  estimatedCost: z
    .number()
    .describe("Estimated cost in IDR. Return 0 if not estimated."),
  notes: z.string().describe("Notes about the activity"),
});

export const ScheduleDaySchema = z.object({
  day: z.number(),
  title: z.string(),
  summary: z.string(),
  activities: z.array(ScheduleActivitySchema),
});

export const ScheduleOutputSchema = z.object({
  destination: z.string(),
  totalDays: z.number(),
  estimatedTotalCost: z
    .number()
    .describe("Estimated total cost in IDR. Return 0 if not estimated."),
  itinerary: z.array(ScheduleDaySchema),
});

export type ScheduleOutput = z.infer<typeof ScheduleOutputSchema>;
