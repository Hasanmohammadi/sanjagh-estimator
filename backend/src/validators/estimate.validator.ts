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
  customerName: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  totalCost: z.number().min(1000000, "قیمت نهایی نمی‌تواند کمتر از ۱,۰۰۰,۰۰۰ تومان باشد"),
  totalMaterialCost: z.number(),
  accessoriesCost: z.number(),
  paints: paintsSchema,
  meterage: z.number(),
  days: z.number().int().positive(),
  visibility: visibilitySchema,
});

export type CreateEstimateInput = z.infer<typeof createEstimateSchema>;

export interface EstimateResponse {
  id: string;
  project_id: string;
  customerName: string;
  notes: string;
  totalCost: number;
  totalMaterialCost: number;
  accessoriesCost: number;
  paints: {
    plastic: { liters: number; total_cost: number; price_per_liter: number };
    oil: { liters: number; total_cost: number; price_per_liter: number };
    acrylic: { liters: number; total_cost: number; price_per_liter: number };
  };
  meterage: number;
  days: number;
  visibility: {
    days: boolean;
    final_cost: boolean;
    materials: boolean;
    paint_area: boolean;
  };
  created_at: string;
  updated_at: string;
}
