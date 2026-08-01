import { z } from "zod";

export const PlaceSchema = z.object({
  name: z.string(),
  category: z.string(),
  description: z.string(),
  estimatedDuration: z.string(),
  reason: z.string(),
  googleMapsLink: z.string().describe("Google Maps link to the place"),
});

export const PlaceResultSchema = z.object({
  places: z.array(PlaceSchema),
});

export type PlaceResult = z.infer<typeof PlaceResultSchema>;
