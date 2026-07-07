import { z } from "zod";

const priceField = (fieldName: string) =>
  z
    .number()
    .positive(`${fieldName} باید بزرگتر از صفر باشد`)
    .min(1000, `${fieldName} نمی‌تواند کمتر از ۱,۰۰۰ تومان باشد`)
    .max(100_000_000, `${fieldName} نمی‌تواند بیشتر از ۱۰۰,۰۰۰,۰۰۰ تومان باشد`)
    .optional();

export const priceConfigSchema = z
  .object({
    currency: z.string().default("تومان"),

    // قیمت هر لیتر رنگ
    plastic_per_liter: priceField("قیمت هر لیتر رنگ پلاستیک"),
    oil_per_liter: priceField("قیمت هر لیتر رنگ روغن"),
    acrylic_per_liter: priceField("قیمت هر لیتر رنگ آکریلیک"),

    // قیمت بدون مصالح
    plastic_without_min: priceField("حداقل قیمت پلاستیک بدون مصالح"),
    plastic_without_max: priceField("حداکثر قیمت پلاستیک بدون مصالح"),
    oil_without_min: priceField("حداقل قیمت روغن بدون مصالح"),
    oil_without_max: priceField("حداکثر قیمت روغن بدون مصالح"),
    acrylic_without_min: priceField("حداقل قیمت آکریلیک بدون مصالح"),
    acrylic_without_max: priceField("حداکثر قیمت آکریلیک بدون مصالح"),
  })
  .refine(
    data => {
      if (data.plastic_without_min && data.plastic_without_max)
        return data.plastic_without_min < data.plastic_without_max;
      return true;
    },
    { message: "حداقل قیمت پلاستیک باید کمتر از حداکثر باشد", path: ["plastic_without_min"] },
  )
  .refine(
    data => {
      if (data.oil_without_min && data.oil_without_max) return data.oil_without_min < data.oil_without_max;
      return true;
    },
    { message: "حداقل قیمت روغن باید کمتر از حداکثر باشد", path: ["oil_without_min"] },
  )
  .refine(
    data => {
      if (data.acrylic_without_min && data.acrylic_without_max)
        return data.acrylic_without_min < data.acrylic_without_max;
      return true;
    },
    { message: "حداقل قیمت آکریلیک باید کمتر از حداکثر باشد", path: ["acrylic_without_min"] },
  );

export type PriceConfigInput = z.infer<typeof priceConfigSchema>;
