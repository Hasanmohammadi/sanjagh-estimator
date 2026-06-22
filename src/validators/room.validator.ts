import { z } from "zod";

const paintTypeEnum = z.enum(["plastic", "oil", "acrylic"]);

const roomTypeEnum = z.enum([
  "bedroom",
  "living_room",
  "kitchen",
  "bathroom",
  "hallway",
  "other",
]);

const baseRoomSchema = z.object({
  type: roomTypeEnum,
  width: z
    .number()
    .positive("عرض اتاق باید عدد مثبت باشد")
    .max(100, "عرض اتاق نمی‌تواند بیشتر از ۱۰۰ متر باشد"),
  length: z
    .number()
    .positive("طول اتاق باید عدد مثبت باشد")
    .max(100, "طول اتاق نمی‌تواند بیشتر از ۱۰۰ متر باشد"),
  height: z
    .number()
    .positive("ارتفاع اتاق باید عدد مثبت باشد")
    .max(20, "ارتفاع اتاق نمی‌تواند بیشتر از ۲۰ متر باشد")
    .default(2.8),
  wall_paint_type: paintTypeEnum,
  wall_coats: z
    .number()
    .int("تعداد دست رنگ باید عدد صحیح باشد")
    .min(1, "حداقل ۱ دست رنگ لازم است")
    .max(5, "حداکثر ۵ دست رنگ مجاز است")
    .default(2),
  ceiling_enabled: z.boolean().default(false),
  ceiling_paint_type: paintTypeEnum.optional(),
  ceiling_coats: z
    .number()
    .int("تعداد دست رنگ سقف باید عدد صحیح باشد")
    .min(1)
    .max(5)
    .optional(),
});

const ceilingRefine = (data: {
  ceiling_enabled?: boolean;
  ceiling_paint_type?: string;
  ceiling_coats?: number;
}) => {
  if (data.ceiling_enabled) {
    return !!data.ceiling_paint_type && !!data.ceiling_coats;
  }
  return true;
};

const ceilingRefineConfig = {
  message: "در صورت فعال بودن رنگ سقف، نوع رنگ و تعداد دست الزامی است",
  path: ["ceiling_paint_type"],
};

export const createRoomSchema = baseRoomSchema.refine(
  ceilingRefine,
  ceilingRefineConfig,
);

export const updateRoomSchema = baseRoomSchema
  .partial()
  .refine(ceilingRefine, ceilingRefineConfig);

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
