import { randomUUID } from "crypto";
import pool from "../db/index";
import { AppError } from "../utils/apiResponse";
import { CreateRoomInput, UpdateRoomInput } from "../validators/draft.validator";
import { isValidUUID } from "../utils/uuid";

export const draftRoomService = {
  /**
   * Get all rooms from user's draft
   */
  async findAll(userId: string) {
    const result = await pool.query(
      `
        SELECT rooms
        FROM drafts
        WHERE user_id = $1
      `,
      [userId],
    );

    // User doesn't have a draft yet
    if (result.rows.length === 0) {
      return [];
    }

    return result.rows[0].rooms || [];
  },

  /**
   * Create a room.
   *
   * If the user doesn't have a draft yet,
   * the draft will be created automatically.
   */
  async create(userId: string, data: CreateRoomInput) {
    const room = {
      id: randomUUID(),
      ...data,
    };

    const result = await pool.query(
      `
        INSERT INTO drafts (
          user_id,
          rooms,
          updated_at
        )
        VALUES (
          $1,
          $2::jsonb,
          NOW()
        )

        ON CONFLICT (user_id)
        DO UPDATE SET
          rooms = COALESCE(drafts.rooms, '[]'::jsonb) || EXCLUDED.rooms,
          updated_at = NOW()

        RETURNING rooms
      `,
      [userId, JSON.stringify([room])],
    );

    const rooms = result.rows[0].rooms;

    return rooms[rooms.length - 1];
  },

  async update(userId: string, roomId: string, data: UpdateRoomInput) {
    if (!isValidUUID(roomId)) {
      throw new AppError("Invalid room id", "شناسه اتاق معتبر نیست", 400);
    }

    const result = await pool.query(
      `
      SELECT rooms
      FROM drafts
      WHERE user_id = $1
    `,
      [userId],
    );

    if (result.rows.length === 0) {
      throw new AppError("Draft not found", "پیش‌نویس یافت نشد", 404);
    }

    const rooms = result.rows[0].rooms || [];

    const roomIndex = rooms.findIndex((room: { id: string }) => room.id === roomId);

    if (roomIndex === -1) {
      throw new AppError("Room not found", "اتاق یافت نشد", 404);
    }

    const updatedRoom = {
      ...rooms[roomIndex],
      ...data,
      id: roomId,
    };

    rooms[roomIndex] = updatedRoom;

    await pool.query(
      `
      UPDATE drafts
      SET
        rooms = $1::jsonb,
        updated_at = NOW()
      WHERE user_id = $2
    `,
      [JSON.stringify(rooms), userId],
    );

    return updatedRoom;
  },
  /**
   * Delete an existing room
   */
  async delete(userId: string, roomId: string) {
    if (!isValidUUID(roomId)) {
      throw new AppError("Invalid room id", "شناسه اتاق معتبر نیست", 400);
    }

    const result = await pool.query(
      `
      SELECT rooms
      FROM drafts
      WHERE user_id = $1
    `,
      [userId],
    );

    if (result.rows.length === 0) {
      throw new AppError("Draft not found", "پیش‌نویس یافت نشد", 404);
    }

    const rooms = result.rows[0].rooms || [];

    const roomIndex = rooms.findIndex((room: { id: string }) => room.id === roomId);

    if (roomIndex === -1) {
      throw new AppError("Room not found", "اتاق یافت نشد", 404);
    }

    const [deletedRoom] = rooms.splice(roomIndex, 1);

    await pool.query(
      `
      UPDATE drafts
      SET
        rooms = $1::jsonb,
        updated_at = NOW()
      WHERE user_id = $2
    `,
      [JSON.stringify(rooms), userId],
    );

    return deletedRoom;
  },
};
