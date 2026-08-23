import { z } from "zod";

export const createProjectSchema = z.object({
  customer_name: z.string().min(2, "نام مشتری باید حداقل ۲ کاراکتر باشد").max(255).trim().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
