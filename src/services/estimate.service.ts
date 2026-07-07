import pool from "../db/index";
import { AppError } from "../utils/apiResponse";
import { calculateEstimate, PriceConfig } from "../utils/calculate";
import { isValidUUID } from "../utils/uuid";
import { CreateEstimateInput } from "../validators/estimate.validator";
import { priceConfigService } from "./price-config.service";

export const estimateService = {
  async create(project_id: string, data: CreateEstimateInput) {
    if (!isValidUUID(project_id)) {
      throw new AppError("Invalid project id", "شناسه پروژه معتبر نیست", 400);
    }

    const project = await pool.query("SELECT id FROM projects WHERE id = $1", [project_id]);

    if (project.rows.length === 0) {
      throw new AppError("Project not found", "پروژه یافت نشد", 404);
    }

    const roomsResult = await pool.query("SELECT * FROM rooms WHERE project_id = $1", [project_id]);

    if (roomsResult.rows.length === 0) {
      throw new AppError("No rooms found for this project", "هیچ اتاقی برای این پروژه وجود ندارد", 400);
    }

    const rooms = roomsResult.rows.map(room => ({
      ...room,
      width: Number(room.width),
      length: Number(room.length),
      height: Number(room.height),
      wall_coats: Number(room.wall_coats),
      ceiling_coats: room.ceiling_coats ? Number(room.ceiling_coats) : undefined,
    }));

    // ساخت config از داده‌های ورودی
    const config: PriceConfig = {
      plastic_per_liter: data.paint_price_per_liter?.plastic,
      oil_per_liter: data.paint_price_per_liter?.oil,
      acrylic_per_liter: data.paint_price_per_liter?.acrylic,
      plastic_without_min: data.paint_prices?.plastic_without,
      plastic_without_max: data.paint_prices?.plastic_without,
      oil_without_min: data.paint_prices?.oil_without,
      oil_without_max: data.paint_prices?.oil_without,
      acrylic_without_min: data.paint_prices?.acrylic_without,
      acrylic_without_max: data.paint_prices?.acrylic_without,
    };

    const estimate = calculateEstimate(rooms, config, data.with_materials);

    const paintSummaryMap = new Map<
      "plastic" | "oil" | "acrylic",
      {
        type: "plastic" | "oil" | "acrylic";
        liters: number;
        total_cost: number;
      }
    >();

    const addPaint = (type: "plastic" | "oil" | "acrylic" | null | undefined, liters: number, totalCost: number) => {
      if (!type || liters === 0) return;

      const current = paintSummaryMap.get(type);

      if (current) {
        current.liters += liters;
        current.total_cost += totalCost;
      } else {
        paintSummaryMap.set(type, {
          type,
          liters,
          total_cost: totalCost,
        });
      }
    };

    estimate.rooms.forEach((roomEstimate, index) => {
      const room = rooms[index];

      addPaint(room.wall_paint_type, roomEstimate.wall_paint_liters, roomEstimate.wall_paint_cost);

      addPaint(room.ceiling_paint_type, roomEstimate.ceiling_paint_liters, roomEstimate.ceiling_paint_cost);
    });

    const paint_summary = Array.from(paintSummaryMap.values());

    const adjusted_labor_cost = estimate.total_labor_cost * data.slider_value;
    const final_cost = data.with_materials
      ? estimate.total_paint_cost + adjusted_labor_cost + estimate.accessories_cost
      : adjusted_labor_cost;

    const result = await pool.query(
      `INSERT INTO estimates
        (project_id, with_materials, slider_value, paint_prices, customer_name, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        project_id,
        data.with_materials,
        data.slider_value,
        JSON.stringify(config),
        data.customer_name || null,
        data.notes || null,
      ],
    );

    const totalMaterialsCost = estimate.total_paint_cost + estimate.accessories_cost;

    return {
      ...result.rows[0],

      calculation: {
        final_cost,
        days: estimate.days,
        paint_area: estimate.total_area,

        materials: {
          paints: paint_summary,
          accessories_cost: estimate.accessories_cost,
          total_materials_cost: totalMaterialsCost,
        },
      },
    };
  },

  async findByProject(project_id: string) {
    if (!isValidUUID(project_id)) {
      throw new AppError("Invalid project id", "شناسه پروژه معتبر نیست", 400);
    }

    const result = await pool.query(
      `SELECT * FROM estimates 
       WHERE project_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [project_id],
    );

    if (result.rows.length === 0) {
      throw new AppError("No estimate found for this project", "برآوردی برای این پروژه یافت نشد", 404);
    }

    return result.rows[0];
  },

  async calculate(project_id: string, userId: string, withMaterials: boolean, sliderValue: number) {
    if (!isValidUUID(project_id)) {
      throw new AppError("Invalid project id", "شناسه پروژه معتبر نیست", 400);
    }

    const project = await pool.query("SELECT id FROM projects WHERE id = $1 AND user_id = $2", [project_id, userId]);

    if (project.rows.length === 0) {
      throw new AppError("Project not found", "پروژه یافت نشد", 404);
    }

    const roomsResult = await pool.query("SELECT * FROM rooms WHERE project_id = $1", [project_id]);

    if (roomsResult.rows.length === 0) {
      throw new AppError("No rooms found for this project", "هیچ اتاقی برای این پروژه وجود ندارد", 400);
    }

    const priceConfigRow = await priceConfigService.findByUser(userId);

    // TODO: اگه config نبود از API سنجاق بگیر
    const config: PriceConfig = priceConfigRow
      ? {
          plastic_per_liter: Number(priceConfigRow.plastic_per_liter) || undefined,
          oil_per_liter: Number(priceConfigRow.oil_per_liter) || undefined,
          acrylic_per_liter: Number(priceConfigRow.acrylic_per_liter) || undefined,
          plastic_without_min: Number(priceConfigRow.plastic_without_min) || undefined,
          plastic_without_max: Number(priceConfigRow.plastic_without_max) || undefined,
          oil_without_min: Number(priceConfigRow.oil_without_min) || undefined,
          oil_without_max: Number(priceConfigRow.oil_without_max) || undefined,
          acrylic_without_min: Number(priceConfigRow.acrylic_without_min) || undefined,
          acrylic_without_max: Number(priceConfigRow.acrylic_without_max) || undefined,
        }
      : {};

    const rooms = roomsResult.rows.map(room => ({
      ...room,
      width: Number(room.width),
      length: Number(room.length),
      height: Number(room.height),
      wall_coats: Number(room.wall_coats),
      ceiling_coats: room.ceiling_coats ? Number(room.ceiling_coats) : undefined,
    }));

    const estimate = calculateEstimate(rooms, config, withMaterials);

    const paintSummaryMap = new Map<
      "plastic" | "oil" | "acrylic",
      {
        type: "plastic" | "oil" | "acrylic";
        liters: number;
        total_cost: number;
      }
    >();

    const addPaint = (type: "plastic" | "oil" | "acrylic" | null | undefined, liters: number, totalCost: number) => {
      if (!type || liters === 0) return;

      const current = paintSummaryMap.get(type);

      if (current) {
        current.liters += liters;
        current.total_cost += totalCost;
      } else {
        paintSummaryMap.set(type, {
          type,
          liters,
          total_cost: totalCost,
        });
      }
    };

    estimate.rooms.forEach((roomEstimate, index) => {
      const room = rooms[index];

      addPaint(room.wall_paint_type, roomEstimate.wall_paint_liters, roomEstimate.wall_paint_cost);

      addPaint(room.ceiling_paint_type, roomEstimate.ceiling_paint_liters, roomEstimate.ceiling_paint_cost);
    });

    const paint_summary = Array.from(paintSummaryMap.values());

    const adjusted_labor_cost = estimate.total_labor_cost * sliderValue;
    const final_cost = withMaterials
      ? estimate.total_paint_cost + adjusted_labor_cost + estimate.accessories_cost
      : adjusted_labor_cost;

    const totalMaterialsCost = estimate.total_paint_cost + estimate.accessories_cost;

    return {
      project_id,
      with_materials: withMaterials,
      slider_value: sliderValue,
      has_price_config: !!priceConfigRow,

      // customer: {
      //   name: data.customer_name,
      //   notes: data.customer_name,
      // },

      calculation: {
        final_cost,
        days: estimate.days,
        paint_area: estimate.total_area,

        materials: {
          paints: paint_summary,
          accessories_cost: estimate.accessories_cost,
          total_materials_cost: totalMaterialsCost,
        },
      },
    };
  },
};
