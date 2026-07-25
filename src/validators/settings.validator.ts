import { z } from "zod";

export const updateSettingsSchema = z.object({
  theme: z.enum(["simple", "normal", "modern", "luxury", "warm", "classic"]),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
