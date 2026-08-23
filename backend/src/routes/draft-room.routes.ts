import { Router, Request, Response } from "express";
import { AppError, asyncHandler, sendSuccess } from "../utils/apiResponse";
import { validate } from "../middlewares/validate";
import { createRoomSchema, updateRoomSchema } from "../validators/draft.validator";
import { draftRoomService } from "../services/draft-room.service";

const router = Router();

// گرفتن اتاق‌های draft
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const rooms = await draftRoomService.findAll(req.user!.id);
    sendSuccess(res, rooms);
  }),
);

// اضافه کردن اتاق
router.post(
  "/",
  validate(createRoomSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const room = await draftRoomService.create(req.user!.id, req.body);
    sendSuccess(res, room, 201);
  }),
);

// ویرایش اتاق
router.patch(
  "/:roomId",
  validate(updateRoomSchema),
  asyncHandler(async (req: Request, res: Response) => {
    if (typeof req.params.roomId === "string") {
      const room = await draftRoomService.update(req.user!.id, req.params.roomId, req.body);
      sendSuccess(res, room);
    }
  }),
);

router.delete(
  "/:roomId",
  asyncHandler(async (req: Request, res: Response) => {
    const { roomId } = req.params;

    if (typeof roomId !== "string") {
      throw new AppError("Invalid room id", "شناسه اتاق معتبر نیست", 400);
    }

    await draftRoomService.delete(req.user!.id, roomId);

    sendSuccess(res, { message: "Room deleted" });
  }),
);
export default router;
