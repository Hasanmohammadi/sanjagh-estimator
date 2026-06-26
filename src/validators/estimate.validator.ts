import { z } from "zod";

const paintPricesSchema = z.object({
  plastic: z.number().positive().optional(),
  oil: z.number().positive().optional(),
  acrylic: z.number().positive().optional(),
});

export const createEstimateSchema = z.object({
  paint_prices: paintPricesSchema,
  labor_price_per_sqm: z
    .number()
    .min(0, "قیمت اجرت نمی‌تواند منفی باشد")
    .default(0),
  with_materials: z.boolean().default(true),
  slider_value: z
    .number()
    .min(0.8, "حداقل مقدار اسلایدر ۰.۸ است")
    .max(1.2, "حداکثر مقدار اسلایدر ۱.۲ است")
    .default(1.0),
  customer_name: z.string().max(255).optional(),
  notes: z.string().optional(),
});

export type CreateEstimateInput = z.infer<typeof createEstimateSchema>;
