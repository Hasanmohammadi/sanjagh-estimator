import { z } from "zod";

export const updateSettingsSchema = z.object({
  theme: z.enum(["professional", "light", "classic", "accurate"]),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
