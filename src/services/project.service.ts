import pool from "../db/index";
import { AppError } from "../utils/apiResponse";
import { isValidUUID } from "../utils/uuid";

type CreateProjectInput = {
  title: string;
  customerName: string;
  meterage: number;
};

export const projectService = {
  async create(data: CreateProjectInput, userId: string) {
    const { title, customerName, meterage } = data;

    const result = await pool.query(
      `INSERT INTO projects (title, customer_name, meterage, user_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
      [title, customerName, meterage, userId],
    );
    return result.rows[0];
  },

  async findAll(userId: string) {
    const result = await pool.query("SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
    return result.rows;
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

    return {
      ...project.rows[0],
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
};
