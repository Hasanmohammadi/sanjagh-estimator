import { z } from "zod";

export const createEstimateSchema = z.object({
  with_materials: z.boolean().default(true),
  notes: z.string().optional(),
});

export type CreateEstimateInput = z.infer<typeof createEstimateSchema>;
