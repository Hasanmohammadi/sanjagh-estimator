import { Router, Request, Response } from "express";
import { asyncHandler, sendSuccess } from "../utils/apiResponse";
import { validate } from "../middlewares/validate";
import { updateSettingsSchema } from "../validators/settings.validator";
import { settingsService } from "../services/settings.service";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const settings = await settingsService.findByUser(req.user!.id);
    sendSuccess(res, settings);
  }),
);

router.put(
  "/",
  validate(updateSettingsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const settings = await settingsService.upsert(req.user!.id, req.body);
    sendSuccess(res, settings);
  }),
);

export default router;
