import { z } from "zod";

export const createEstimateSchema = z.object({
  paint_prices: z.object({
    plastic_with: z.number().positive().optional(),
    plastic_without: z.number().positive().optional(),
    oil_with: z.number().positive().optional(),
    oil_without: z.number().positive().optional(),
    acrylic_with: z.number().positive().optional(),
    acrylic_without: z.number().positive().optional(),
  }),
  paint_price_per_liter: z
    .object({
      plastic: z.number().positive().optional(),
      oil: z.number().positive().optional(),
      acrylic: z.number().positive().optional(),
    })
    .default({}),
  with_materials: z.boolean().default(true),
  slider_value: z.number().min(0.8).max(1.2).default(1.0),
  customer_name: z.string().max(255).optional(),
  notes: z.string().optional(),
});

export type CreateEstimateInput = z.infer<typeof createEstimateSchema>;
