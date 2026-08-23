import pool from "../db/index";
import { AppError } from "../utils/apiResponse";
import { isValidUUID } from "../utils/uuid";

export const projectService = {
  async findAll(userId: string) {
    const result = await pool.query(
      `
      SELECT *
      FROM projects
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
      [userId],
    );

    const projects = await Promise.all(
      result.rows.map(async project => {
        const rooms = await pool.query(
          `
          SELECT
            width,
            length,
            height,
            ceiling_enabled
          FROM rooms
          WHERE project_id = $1
        `,
          [project.id],
        );

        const meterage = rooms.rows.reduce((sum, room) => {
          const wallArea = 2 * (Number(room.width) + Number(room.length)) * Number(room.height);

          const ceilingArea = room.ceiling_enabled ? Number(room.width) * Number(room.length) : 0;

          return sum + wallArea + ceilingArea;
        }, 0);

        return {
          ...project,
          meterage: Math.round(meterage * 100) / 100,
        };
      }),
    );

    return projects;
  },

  async findById(id: string, userId: string) {
    if (!isValidUUID(id)) {
      throw new AppError("Invalid project id", "شناسه پروژه معتبر نیست", 400);
    }

    const projectResult = await pool.query(
      `
        SELECT *
        FROM projects
        WHERE id = $1
          AND user_id = $2
      `,
      [id, userId],
    );

    if (projectResult.rows.length === 0) {
      throw new AppError("Project not found", "پروژه یافت نشد", 404);
    }

    const roomsResult = await pool.query(
      `
        SELECT *
        FROM rooms
        WHERE project_id = $1
        ORDER BY created_at ASC
      `,
      [id],
    );

    const rooms = roomsResult.rows;

    const meterage = rooms.reduce((sum, room) => {
      const wallArea = 2 * (Number(room.width) + Number(room.length)) * Number(room.height);

      const ceilingArea = room.ceiling_enabled ? Number(room.width) * Number(room.length) : 0;

      return sum + wallArea + ceilingArea;
    }, 0);

    return {
      ...projectResult.rows[0],
      meterage: Math.round(meterage * 100) / 100,
      rooms,
    };
  },

  async delete(id: string, userId: string) {
    if (!isValidUUID(id)) {
      throw new AppError("Invalid project id", "شناسه پروژه معتبر نیست", 400);
    }

    const result = await pool.query(
      `
        DELETE FROM projects
        WHERE id = $1
          AND user_id = $2
        RETURNING *
      `,
      [id, userId],
    );

    if (result.rows.length === 0) {
      throw new AppError("Project not found", "پروژه یافت نشد", 404);
    }

    return result.rows[0];
  },
};
