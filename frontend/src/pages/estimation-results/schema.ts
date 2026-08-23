import * as yup from "yup";

const paintDetailSchema = yup.object({
  liters: yup.number().required(),
  total_cost: yup.number().required(),
  price_per_liter: yup.number().required(),
});

export const estimateSchema = yup.object({
  customerName: yup.string().trim().max(20, "نام مشتری حداکثر 20 کاراکتر است").required("نام مشتری الزامی است"),

  notes: yup.string().trim().max(1000, "توضیحات حداکثر 1000 کاراکتر است").defined(),

  totalCost: yup.number().required(),
  minTotalPrice: yup.number(),
  maxTotalPrice: yup.number(),

  accessoriesCost: yup.number().required(),

  paints: yup
    .object({
      plastic: paintDetailSchema.required(),
      oil: paintDetailSchema.required(),
      acrylic: paintDetailSchema.required(),
    })
    .required(),

  meterage: yup.number().required(),

  days: yup.number().required(),

  totalMaterialCost: yup.number().required(),

  visibility: yup.object({
    final_cost: yup.boolean().optional().default(true),
    days: yup.boolean().optional().default(true),
    paint_area: yup.boolean().optional().default(true),
    materials: yup.boolean().optional().default(true),
  }),
});

export type EstimateFormValues = yup.InferType<typeof estimateSchema>;
