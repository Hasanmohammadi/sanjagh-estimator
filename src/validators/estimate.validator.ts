import { z } from "zod";

const paintDetailSchema = z.object({
  liters: z.number(),
  total_cost: z.number(),
  price_per_liter: z.number(),
});

const paintsSchema = z.object({
  plastic: paintDetailSchema,
  oil: paintDetailSchema,
  acrylic: paintDetailSchema,
});

const visibilitySchema = z.object({
  days: z.boolean().default(true),
  final_cost: z.boolean().default(true),
  materials: z.boolean().default(true),
  paint_area: z.boolean().default(true),
});

export const createEstimateSchema = z.object({
  customerName: z.string(),
  notes: z.string(),

  totalCost: z.number(),
  totalMaterialCost: z.number(),
  accessoriesCost: z.number(),

  paints: paintsSchema,

  meterage: z.number(),
  days: z.number(),

  visibility: visibilitySchema,
});

export type CreateEstimateInput = z.infer<typeof createEstimateSchema>;
export type EstimateResponse = z.infer<typeof createEstimateSchema>;
