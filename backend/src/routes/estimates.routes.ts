import { Router } from "express";
import { asyncHandler, sendSuccess } from "../utils/apiResponse";
import { estimateService } from "../services/estimate.service";

interface EstimateParams {
  project_id: string;
}

const router = Router({ mergeParams: true });

router.get(
  "/",
  asyncHandler<EstimateParams>(async (req, res) => {
    const estimate = await estimateService.findByProject(req.params.project_id);
    sendSuccess(res, estimate);
  }),
);

export default router;
