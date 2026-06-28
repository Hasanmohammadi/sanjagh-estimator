import { z } from "zod";

const positivePrice = (fieldName: string) =>
  z
    .number()
    .positive(`${fieldName} باید بزرگتر از صفر باشد`)
    .min(1000, `${fieldName} نمی‌تواند کمتر از ۱,۰۰۰ تومان باشد`)
    .max(100_000_000, `${fieldName} نمی‌تواند بیشتر از ۱۰۰,۰۰۰,۰۰۰ تومان باشد`);

export const priceConfigSchema = z
  .object({
    currency: z.string().default("تومان"),

    plastic_per_liter: positivePrice("قیمت هر لیتر رنگ پلاستیک"),
    plastic_sqm_min: positivePrice("حداقل قیمت هر متر مربع رنگ پلاستیک"),
    plastic_sqm_max: positivePrice("حداکثر قیمت هر متر مربع رنگ پلاستیک"),

    oil_per_liter: positivePrice("قیمت هر لیتر رنگ روغن"),
    oil_sqm_min: positivePrice("حداقل قیمت هر متر مربع رنگ روغن"),
    oil_sqm_max: positivePrice("حداکثر قیمت هر متر مربع رنگ روغن"),

    acrylic_per_liter: positivePrice("قیمت هر لیتر رنگ آکریلیک"),
    acrylic_sqm_min: positivePrice("حداقل قیمت هر متر مربع رنگ آکریلیک"),
    acrylic_sqm_max: positivePrice("حداکثر قیمت هر متر مربع رنگ آکریلیک"),
  })
  .refine(data => data.plastic_sqm_min < data.plastic_sqm_max, {
    message: "حداقل قیمت پلاستیک باید کمتر از حداکثر باشد",
    path: ["plastic_sqm_min"],
  })
  .refine(data => data.oil_sqm_min < data.oil_sqm_max, {
    message: "حداقل قیمت روغن باید کمتر از حداکثر باشد",
    path: ["oil_sqm_min"],
  })
  .refine(data => data.acrylic_sqm_min < data.acrylic_sqm_max, {
    message: "حداقل قیمت آکریلیک باید کمتر از حداکثر باشد",
    path: ["acrylic_sqm_min"],
  });

export type PriceConfigInput = z.infer<typeof priceConfigSchema>;
