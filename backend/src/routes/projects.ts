import { Router, Request, Response } from "express";
import { asyncHandler, sendSuccess } from "../utils/apiResponse";
import { projectService } from "../services/project.service";

interface ProjectParams {
  id: string;
}

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const projects = await projectService.findAll(req.user!.id);
    sendSuccess(res, projects);
  }),
);

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

export default router;
