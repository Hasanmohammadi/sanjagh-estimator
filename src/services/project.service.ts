import pool from "../db/index";
import { AppError } from "../utils/apiResponse";

export const projectService = {
  async create(title: string) {
    const result = await pool.query(
      "INSERT INTO projects (title) VALUES ($1) RETURNING *",
      [title],
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query(
      "SELECT * FROM projects ORDER BY created_at DESC",
    );
    return result.rows;
  },

  async findById(id: string) {
    const project = await pool.query("SELECT * FROM projects WHERE id = $1", [
      id,
    ]);

    if (project.rows.length === 0) {
      throw new AppError("Project not found", "پروژه یافت نشد", 404);
    }

    const rooms = await pool.query(
      "SELECT * FROM rooms WHERE project_id = $1 ORDER BY created_at ASC",
      [id],
    );

    return {
      ...project.rows[0],
      rooms: rooms.rows,
    };
  },

  async delete(id: string) {
    const result = await pool.query(
      "DELETE FROM projects WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      throw new AppError("Project not found", "پروژه یافت نشد", 404);
    }

    return result.rows[0];
  },
};
