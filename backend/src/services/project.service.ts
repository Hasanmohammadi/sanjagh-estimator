import pool from "../db/index";
import { AppError } from "../utils/apiResponse";
import { isValidUUID } from "../utils/uuid";

type CreateProjectInput = {
  title: string;
  customerName: string;
};

export const projectService = {
  async create(data: CreateProjectInput, userId: string) {
    const { title, customerName } = data;

    const result = await pool.query(
      `INSERT INTO projects (title, customer_name, user_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
      [title, customerName || null, userId],
    );
    return result.rows[0];
  },

  async findAll(userId: string) {
    // Delete project that doesn't have any rooms after 5 minutes
    await pool.query(
      `DELETE FROM projects 
     WHERE user_id = $1
     AND created_at < NOW() - INTERVAL '5 minutes'
     AND id NOT IN (
       SELECT DISTINCT project_id FROM rooms
     )`,
      [userId],
    );

    const result = await pool.query("SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC", [userId]);

    const projectsWithMeterage = await Promise.all(
      result.rows.map(async project => {
        const rooms = await pool.query(
          "SELECT width, length, height, ceiling_enabled FROM rooms WHERE project_id = $1",
          [project.id],
        );

        const meterage = rooms.rows.reduce((sum, room) => {
          const wall_area = 2 * (room.width + room.length) * room.height;
          const ceiling_area = room.ceiling_enabled ? room.width * room.length : 0;
          return sum + wall_area + ceiling_area;
        }, 0);

        return {
          ...project,
          meterage: Math.round(meterage * 100) / 100,
        };
      }),
    );

    return projectsWithMeterage;
  },

  async findById(id: string, userId: string) {
    if (!isValidUUID(id)) {
      throw new AppError("Invalid project id", "شناسه پروژه معتبر نیست", 400);
    }

    const project = await pool.query("SELECT * FROM projects WHERE id = $1 AND user_id = $2", [id, userId]);

    if (project.rows.length === 0) {
      throw new AppError("Project not found", "پروژه یافت نشد", 404);
    }

    const rooms = await pool.query("SELECT * FROM rooms WHERE project_id = $1 ORDER BY created_at ASC", [id]);

    const meterage = rooms.rows.reduce((sum, room) => {
      const wall_area = 2 * (room.width + room.length) * room.height;
      const ceiling_area = room.ceiling_enabled ? room.width * room.length : 0;
      return sum + wall_area + ceiling_area;
    }, 0);

    return {
      ...project.rows[0],
      meterage: Math.round(meterage * 100) / 100,
      rooms: rooms.rows,
    };
  },

  async delete(id: string, userId: string) {
    if (!isValidUUID(id)) {
      throw new AppError("Invalid project id", "شناسه پروژه معتبر نیست", 400);
    }

    const result = await pool.query("DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING *", [id, userId]);

    if (result.rows.length === 0) {
      throw new AppError("Project not found", "پروژه یافت نشد", 404);
    }

    return result.rows[0];
  },
  async duplicate(id: string, userId: string) {
    if (!isValidUUID(id)) {
      throw new AppError("Invalid project id", "شناسه پروژه معتبر نیست", 400);
    }

    const project = await pool.query("SELECT * FROM projects WHERE id = $1 AND user_id = $2", [id, userId]);

    if (project.rows.length === 0) {
      throw new AppError("Project not found", "پروژه یافت نشد", 404);
    }

    const original = project.rows[0];

    const newProject = await pool.query(
      `INSERT INTO projects (user_id, title, customer_name)
        VALUES ($1, $2, $3)
      RETURNING *`,
      [userId, original.title, original.title],
    );

    const newProjectId = newProject.rows[0].id;

    const rooms = await pool.query("SELECT * FROM rooms WHERE project_id = $1", [id]);

    for (const room of rooms.rows) {
      await pool.query(
        `INSERT INTO rooms 
        (project_id, type, width, length, height, wall_paint_type, wall_coats, ceiling_enabled, ceiling_paint_type, ceiling_coats)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          newProjectId,
          room.type,
          room.width,
          room.length,
          room.height,
          room.wall_paint_type,
          room.wall_coats,
          room.ceiling_enabled,
          room.ceiling_paint_type,
          room.ceiling_coats,
        ],
      );
    }

    return this.findById(newProjectId, userId);
  },
};
