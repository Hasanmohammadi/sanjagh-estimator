import { Router, Request, Response } from "express";
import { asyncHandler, sendSuccess } from "../utils/apiResponse";
import { validate } from "../middlewares/validate";
import { priceConfigSchema } from "../validators/price-config.validator";
import { priceConfigService } from "../services/price-config.service";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const config = await priceConfigService.findByUser(req.user!.id);
    sendSuccess(res, config);
  }),
);

router.put(
  "/",
  validate(priceConfigSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const config = await priceConfigService.upsert(req.user!.id, req.body);
    sendSuccess(res, config);
  }),
);

export default router;
