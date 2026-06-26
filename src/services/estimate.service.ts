import pool from "../db/index";
import { AppError } from "../utils/apiResponse";
import { calculateEstimate } from "../utils/calculate";
import { CreateEstimateInput } from "../validators/estimate.validator";

export const estimateService = {
  async create(project_id: string, data: CreateEstimateInput) {
    // چک کردن وجود پروژه
    const project = await pool.query("SELECT id FROM projects WHERE id = $1", [
      project_id,
    ]);

    if (project.rows.length === 0) {
      throw new AppError("Project not found", "پروژه یافت نشد", 404);
    }

    // گرفتن اتاق‌ها
    const roomsResult = await pool.query(
      "SELECT * FROM rooms WHERE project_id = $1",
      [project_id],
    );

    if (roomsResult.rows.length === 0) {
      throw new AppError(
        "No rooms found for this project",
        "هیچ اتاقی برای این پروژه وجود ندارد",
        400,
      );
    }

    // تبدیل string به number
    const rooms = roomsResult.rows.map((room) => ({
      ...room,
      width: Number(room.width),
      length: Number(room.length),
      height: Number(room.height),
      wall_coats: Number(room.wall_coats),
      ceiling_coats: room.ceiling_coats
        ? Number(room.ceiling_coats)
        : undefined,
    }));

    // محاسبه برآورد
    const estimate = calculateEstimate(
      rooms,
      data.paint_prices,
      data.labor_price_per_sqm,
    );

    // اعمال slider روی اجرت
    const adjusted_labor_cost = estimate.total_labor_cost * data.slider_value;
    const final_cost = data.with_materials
      ? estimate.total_paint_cost +
        adjusted_labor_cost +
        estimate.accessories_cost
      : adjusted_labor_cost;

    // ذخیره در دیتابیس
    const result = await pool.query(
      `INSERT INTO estimates
        (project_id, with_materials, slider_value, paint_prices, customer_name, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        project_id,
        data.with_materials,
        data.slider_value,
        JSON.stringify(data.paint_prices),
        data.customer_name || null,
        data.notes || null,
      ],
    );

    return {
      ...result.rows[0],
      calculation: {
        ...estimate,
        adjusted_labor_cost,
        final_cost,
      },
    };
  },

  async findByProject(project_id: string) {
    const result = await pool.query(
      `SELECT * FROM estimates 
       WHERE project_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [project_id],
    );

    if (result.rows.length === 0) {
      throw new AppError(
        "No estimate found for this project",
        "برآوردی برای این پروژه یافت نشد",
        404,
      );
    }

    return result.rows[0];
  },
};
