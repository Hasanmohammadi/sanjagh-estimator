import { Router, Request, Response } from "express";
import { asyncHandler, sendSuccess } from "../utils/apiResponse";
import { validate } from "../middlewares/validate";
import { createProjectSchema } from "../validators/project.validator";
import { projectService } from "../services/project.service";

const router = Router();

router.post(
  "/",
  validate(createProjectSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.create(req.body, req.user!.id);
    sendSuccess(res, project, 201);
  }),
);

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const projects = await projectService.findAll(req.user!.id);
    sendSuccess(res, projects);
  }),
);

interface ProjectParams {
  id: string;
}

router.get(
  "/:id",
  asyncHandler<ProjectParams>(async (req, res) => {
    const project = await projectService.findById(req.params.id, req.user!.id);
    sendSuccess(res, project);
  }),
);

router.delete(
  "/:id",
  asyncHandler<ProjectParams>(async (req, res) => {
    await projectService.delete(req.params.id, req.user!.id);
    sendSuccess(res, { message: "Project deleted successfully" });
  }),
);

router.post(
  "/:id/duplicate",
  asyncHandler<ProjectParams>(async (req, res) => {
    const project = await projectService.duplicate(req.params.id, req.user!.id);
    sendSuccess(res, project, 201);
  }),
);

export default router;
