import pool from "../db/index";
import { AppError } from "../utils/apiResponse";
import { CreateRoomInput, UpdateRoomInput } from "../validators/room.validator";

export const roomService = {
  async checkProjectExists(project_id: string) {
    const project = await pool.query("SELECT id FROM projects WHERE id = $1", [
      project_id,
    ]);

    if (project.rows.length === 0) {
      throw new AppError("Project not found", "پروژه یافت نشد", 404);
    }
  },

  async create(project_id: string, data: CreateRoomInput) {
    await this.checkProjectExists(project_id);

    const result = await pool.query(
      `INSERT INTO rooms 
        (project_id, type, width, length, height, wall_paint_type, wall_coats, ceiling_enabled, ceiling_paint_type, ceiling_coats)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        project_id,
        data.type,
        data.width,
        data.length,
        data.height,
        data.wall_paint_type,
        data.wall_coats,
        data.ceiling_enabled,
        data.ceiling_paint_type || null,
        data.ceiling_coats || null,
      ],
    );

    return result.rows[0];
  },

  async update(room_id: string, data: UpdateRoomInput) {
    const id = parseInt(room_id, 10);

    if (isNaN(id)) {
      throw new AppError("Invalid room id", "شناسه اتاق معتبر نیست", 400);
    }

    const result = await pool.query(
      `UPDATE rooms SET
      type = COALESCE($1, type),
      width = COALESCE($2, width),
      length = COALESCE($3, length),
      height = COALESCE($4, height),
      wall_paint_type = COALESCE($5, wall_paint_type),
      wall_coats = COALESCE($6, wall_coats),
      ceiling_enabled = COALESCE($7, ceiling_enabled),
      ceiling_paint_type = COALESCE($8, ceiling_paint_type),
      ceiling_coats = COALESCE($9, ceiling_coats),
      updated_at = NOW()
    WHERE id = $10
    RETURNING *`,
      [
        data.type,
        data.width,
        data.length,
        data.height,
        data.wall_paint_type,
        data.wall_coats,
        data.ceiling_enabled,
        data.ceiling_paint_type || null,
        data.ceiling_coats || null,
        id,
      ],
    );

    if (result.rows.length === 0) {
      throw new AppError("Room not found", "اتاق یافت نشد", 404);
    }

    return result.rows[0];
  },

  async delete(room_id: string) {
    const id = parseInt(room_id, 10);

    if (isNaN(id)) {
      throw new AppError("Invalid room id", "شناسه اتاق معتبر نیست", 400);
    }

    const result = await pool.query(
      "DELETE FROM rooms WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      throw new AppError("Room not found", "اتاق یافت نشد", 404);
    }

    return result.rows[0];
  },
};
