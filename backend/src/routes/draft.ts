import { Router, Request, Response } from "express";
import { asyncHandler, sendSuccess, AppError } from "../utils/apiResponse";
import { validate } from "../middlewares/validate";
import { updateDraftSchema } from "../validators/draft.validator";
import { createEstimateSchema } from "../validators/estimate.validator";
import { draftService } from "../services/draft.service";
import { isValidUUID } from "../utils/uuid";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const draft = await draftService.findByUser(req.user!.id);
    sendSuccess(res, draft);
  }),
);

router.put(
  "/",
  validate(updateDraftSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const draft = await draftService.upsert(req.user!.id, req.body);
    sendSuccess(res, draft);
  }),
);

// پاک کردن draft
router.delete(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    await draftService.clear(req.user!.id);
    sendSuccess(res, { message: "Draft cleared" });
  }),
);

// محاسبه برآورد از روی draft
router.get(
  "/calculate",
  asyncHandler(async (req: Request, res: Response) => {
    const result = await draftService.calculate(req.user!.id);
    sendSuccess(res, result);
  }),
);

// تبدیل draft به پروژه واقعی
router.post(
  "/complete",
  validate(createEstimateSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const project = await draftService.complete(req.user!.id, req.body);
    sendSuccess(res, project, 201);
  }),
);

// کپی پروژه به draft
router.post(
  "/copy-project-to-draft/:projectId",
  asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params;

    if (typeof projectId === "string") {
      if (!isValidUUID(projectId)) {
        throw new AppError("Invalid project id", "شناسه پروژه معتبر نیست", 400);
      }

      const draft = await draftService.fromProject(req.user!.id, projectId);
      sendSuccess(res, draft);
    } else {
      throw new AppError("Invalid project id", "شناسه پروژه معتبر نیست", 400);
    }
  }),
);

export default router;
