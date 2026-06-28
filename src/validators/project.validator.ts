import { z } from "zod";

export const createProjectSchema = z.object({
  title: z
    .string()
    .min(2, "عنوان پروژه باید حداقل ۲ کاراکتر باشد")
    .max(255, "عنوان پروژه نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد")
    .trim(),

  customerName: z.string().min(2, "نام مشتری باید حداقل ۲ کاراکتر باشد").max(255).trim().optional(),

  meterage: z.number().positive("متراژ باید بزرگ‌تر از صفر باشد").optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
