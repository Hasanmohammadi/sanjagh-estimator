import { Router, Request, Response } from "express";
import { asyncHandler, sendSuccess } from "../utils/apiResponse";
import { validate } from "../middlewares/validate";
import {
  createRoomSchema,
  updateRoomSchema,
} from "../validators/room.validator";
import { roomService } from "../services/room.service";

interface RoomParams {
  project_id: string;
  room_id: string;
}

const router = Router({ mergeParams: true });

router.post(
  "/",
  validate<RoomParams>(createRoomSchema),
  asyncHandler<RoomParams>(async (req, res) => {
    const room = await roomService.create(req.params.project_id, req.body);
    sendSuccess(res, room, 201);
  }),
);

router.put(
  "/:room_id",
  validate<RoomParams>(updateRoomSchema),
  asyncHandler<RoomParams>(async (req, res) => {
    const room = await roomService.update(req.params.room_id, req.body);
    sendSuccess(res, room);
  }),
);

router.delete(
  "/:room_id",
  asyncHandler<RoomParams>(async (req, res) => {
    await roomService.delete(req.params.room_id);
    sendSuccess(res, { message: "Room deleted successfully" });
  }),
);

export default router;
