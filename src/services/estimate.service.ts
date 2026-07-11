import pool from "../db/index";
import { AppError } from "../utils/apiResponse";
import { calculateEstimate, PriceConfig } from "../utils/calculate";
import { isValidUUID } from "../utils/uuid";
import { CreateEstimateInput } from "../validators/estimate.validator";
import { priceConfigService } from "./price-config.service";

export const estimateService = {
  async create(project_id: string, userId: string, data: CreateEstimateInput) {
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

    // گرفتن price_config
    const priceConfigRow = await priceConfigService.findByUser(userId);

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

    const estimate = calculateEstimate(rooms, config, data.with_materials);

    // paint details
    const paintSummaryMap = new Map<"plastic" | "oil" | "acrylic", { liters: number; total_cost: number }>();

    estimate.rooms.forEach((roomEstimate, index) => {
      const room = rooms[index];

      const addPaint = (type: "plastic" | "oil" | "acrylic" | null | undefined, liters: number, totalCost: number) => {
        if (!type || liters === 0) return;
        const current = paintSummaryMap.get(type);
        if (current) {
          current.liters += liters;
          current.total_cost += totalCost;
        } else {
          paintSummaryMap.set(type, { liters, total_cost: totalCost });
        }
      };

      addPaint(room.wall_paint_type, roomEstimate.wall_paint_liters, roomEstimate.wall_paint_cost);
      addPaint(room.ceiling_paint_type, roomEstimate.ceiling_paint_liters, roomEstimate.ceiling_paint_cost);
    });

    const paints = {
      plastic: {
        liters: paintSummaryMap.get("plastic")?.liters ?? 0,
        total_cost: paintSummaryMap.get("plastic")?.total_cost ?? 0,
        price_per_liter: config.plastic_per_liter ?? 0,
      },
      oil: {
        liters: paintSummaryMap.get("oil")?.liters ?? 0,
        total_cost: paintSummaryMap.get("oil")?.total_cost ?? 0,
        price_per_liter: config.oil_per_liter ?? 0,
      },
      acrylic: {
        liters: paintSummaryMap.get("acrylic")?.liters ?? 0,
        total_cost: paintSummaryMap.get("acrylic")?.total_cost ?? 0,
        price_per_liter: config.acrylic_per_liter ?? 0,
      },
    };

    const adjusted_labor_cost = estimate.total_labor_cost;
    const final_cost = data.with_materials
      ? estimate.total_paint_cost + adjusted_labor_cost + estimate.accessories_cost
      : adjusted_labor_cost;

    const result = await pool.query(
      `INSERT INTO estimates
          (project_id, with_materials, paint_prices, notes)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (project_id) DO UPDATE SET
           with_materials = EXCLUDED.with_materials,
           paint_prices   = EXCLUDED.paint_prices,
           notes          = EXCLUDED.notes,
           updated_at     = NOW()
         RETURNING *`,
      [project_id, data.with_materials, JSON.stringify(config), data.notes || null],
    );

    const totalMaterialsCost = estimate.total_paint_cost + estimate.accessories_cost;

    return {
      ...result.rows[0],
      calculation: {
        final_cost,
        days: estimate.days,
        paint_area: estimate.total_area,
        total_paint_cost: estimate.total_paint_cost,
        materials: {
          paints,
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

  async calculate(project_id: string, userId: string, withMaterials: boolean) {
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
          plastic_per_liter: priceConfigRow.plastic_per_liter || undefined,
          oil_per_liter: priceConfigRow.oil_per_liter || undefined,
          acrylic_per_liter: priceConfigRow.acrylic_per_liter || undefined,
          plastic_without_min: priceConfigRow.plastic_without_min || undefined,
          plastic_without_max: priceConfigRow.plastic_without_max || undefined,
          oil_without_min: priceConfigRow.oil_without_min || undefined,
          oil_without_max: priceConfigRow.oil_without_max || undefined,
          acrylic_without_min: priceConfigRow.acrylic_without_min || undefined,
          acrylic_without_max: priceConfigRow.acrylic_without_max || undefined,
        }
      : {};

    const rooms = roomsResult.rows.map(room => ({
      ...room,
      width: room.width,
      length: room.length,
      height: room.height,
      wall_coats: room.wall_coats,
      ceiling_coats: room.ceiling_coats ? room.ceiling_coats : undefined,
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

    const paints = {
      plastic: {
        liters: paintSummaryMap.get("plastic")?.liters ?? 0,
        total_cost: paintSummaryMap.get("plastic")?.total_cost ?? 0,
        price_per_liter: config.plastic_per_liter ?? 0,
      },
      oil: {
        liters: paintSummaryMap.get("oil")?.liters ?? 0,
        total_cost: paintSummaryMap.get("oil")?.total_cost ?? 0,
        price_per_liter: config.oil_per_liter ?? 0,
      },
      acrylic: {
        liters: paintSummaryMap.get("acrylic")?.liters ?? 0,
        total_cost: paintSummaryMap.get("acrylic")?.total_cost ?? 0,
        price_per_liter: config.acrylic_per_liter ?? 0,
      },
    };
    const adjusted_labor_cost = estimate.total_labor_cost;
    const final_cost = withMaterials
      ? Math.ceil(estimate.total_paint_cost / 1_000_000) +
        Math.ceil(adjusted_labor_cost / 1_000_000) +
        Math.ceil(estimate.accessories_cost / 1_000_000)
      : Math.ceil(adjusted_labor_cost / 1_000_000);

    const totalMaterialsCost =
      Math.ceil(estimate.total_paint_cost) + Math.ceil(estimate.accessories_cost / 500_000) * 500_000;

    return {
      project_id,
      with_materials: withMaterials,
      has_price_config: !!priceConfigRow,

      // customer: {
      //   name: data.customer_name,
      //   notes: data.customer_name,
      // },

      calculation: {
        final_cost,
        days: estimate.days,
        paint_area: Number(estimate.total_area.toFixed(1)),

        materials: {
          paints,
          accessories_cost: Math.ceil(estimate.accessories_cost / 500_000) * 500_000,
          total_materials_cost: totalMaterialsCost,
        },
      },
    };
  },
};
