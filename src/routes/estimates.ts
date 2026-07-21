import { Router } from "express";
import { asyncHandler, sendSuccess } from "../utils/apiResponse";
import { validate } from "../middlewares/validate";
import { createEstimateSchema } from "../validators/estimate.validator";
import { estimateService } from "../services/estimate.service";

interface EstimateParams {
  project_id: string;
}

const router = Router({ mergeParams: true });

router.post(
  "/",
  validate<EstimateParams>(createEstimateSchema),
  asyncHandler<EstimateParams>(async (req, res) => {
    const estimate = await estimateService.create(req.params.project_id, req.user!.id, req.body);
    sendSuccess(res, estimate, 201);
  }),
);

router.get(
  "/",
  asyncHandler<EstimateParams>(async (req, res) => {
    const estimate = await estimateService.findByProject(req.params.project_id);
    sendSuccess(res, estimate);
  }),
);

router.get(
  "/calculate",
  asyncHandler<EstimateParams>(async (req, res) => {
    const result = await estimateService.calculate(req.params.project_id, req.user!.id);
    sendSuccess(res, result);
  }),
);

export default router;
