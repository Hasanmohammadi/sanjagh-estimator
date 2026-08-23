import { z } from "zod";

export const paintTypeEnum = z.enum(["plastic", "oil", "acrylic"]);

export const roomTypeEnum = z.enum(["bedroom", "living_room", "kitchen", "bathroom", "hallway", "other"]);

export const roomSchema = z.object({
  type: roomTypeEnum,

  width: z.number().positive("عرض اتاق باید عدد مثبت باشد").max(100, "عرض اتاق نمی‌تواند بیشتر از ۱۰۰ متر باشد"),

  length: z.number().positive("طول اتاق باید عدد مثبت باشد").max(100, "طول اتاق نمی‌تواند بیشتر از ۱۰۰ متر باشد"),

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
    .min(1, "حداقل ۱ دست رنگ سقف لازم است")
    .max(5, "حداکثر ۵ دست رنگ سقف مجاز است")
    .optional(),
});

/**
 * Validate ceiling fields
 */
const ceilingRefine = (data: { ceiling_enabled?: boolean; ceiling_paint_type?: string; ceiling_coats?: number }) => {
  if (!data.ceiling_enabled) {
    return true;
  }

  return !!data.ceiling_paint_type && !!data.ceiling_coats;
};

const ceilingRefineConfig = {
  message: "در صورت فعال بودن رنگ سقف، نوع رنگ و تعداد دست الزامی است",
  path: ["ceiling_paint_type"],
};

/**
 * Create Room
 */
export const createRoomSchema = roomSchema.refine(ceilingRefine, ceilingRefineConfig);

/**
 * Update Room
 */
export const updateRoomSchema = roomSchema.partial().refine(ceilingRefine, ceilingRefineConfig);

/**
 * Room stored inside Draft
 */
export const draftRoomSchema = roomSchema.extend({
  id: z.string().uuid(),
});

/**
 * Update Draft
 *
 * rooms از اینجا مدیریت نمی‌شود.
 * Roomها فقط از طریق Room API مدیریت می‌شوند.
 */
export const updateDraftSchema = z.object({
  customer_name: z
    .string()
    .min(2, "نام مشتری حداقل باید ۲ کاراکتر باشد")
    .max(255, "نام مشتری نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد")
    .optional(),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;

export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;

export type DraftRoom = z.infer<typeof draftRoomSchema>;

export type UpdateDraftInput = z.infer<typeof updateDraftSchema>;
