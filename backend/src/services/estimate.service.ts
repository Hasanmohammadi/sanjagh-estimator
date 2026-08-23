import pool from "../db/index";
import { AppError } from "../utils/apiResponse";
import { calculateEstimate, PriceConfig } from "../utils/calculate";
import { isValidUUID } from "../utils/uuid";
import { CreateEstimateInput, EstimateResponse } from "../validators/estimate.validator";
import { priceConfigService } from "./price-config.service";

type CalculateEstimateResponse = {
  project_id: string;
  has_price_config: boolean;
  calculation: {
    final_cost: number;
    min_total_price: number;
    max_total_price: number;
    days: number;
    paint_area: number;
    materials: {
      paints: {
        plastic: {
          liters: number;
          total_cost: number;
          price_per_liter: number;
        };
        oil: {
          liters: number;
          total_cost: number;
          price_per_liter: number;
        };
        acrylic: {
          liters: number;
          total_cost: number;
          price_per_liter: number;
        };
      };
      accessories_cost: number;
      total_materials_cost: number;
    };
  };
};

const mapEstimate = (row: any): EstimateResponse => ({
  id: row.id,
  project_id: row.project_id,
  customerName: row.customer_name ?? "",
  notes: row.notes ?? "",
  totalCost: Number(row.total_cost),
  totalMaterialCost: Number(row.total_material_cost),
  accessoriesCost: Number(row.accessories_cost),
  paints: row.paints,
  meterage: Number(row.meterage),
  days: Number(row.days),
  visibility: row.visibility,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export const estimateService = {
  async create(projectId: string, userId: string, data: CreateEstimateInput): Promise<EstimateResponse> {
    if (!isValidUUID(projectId)) {
      throw new AppError("Invalid project id", "شناسه پروژه معتبر نیست", 400);
    }

    // بررسی پروژه و مالکیت آن
    const project = await pool.query(
      `
        SELECT id
        FROM projects
        WHERE id = $1
          AND user_id = $2
      `,
      [projectId, userId],
    );

    if (project.rows.length === 0) {
      throw new AppError("Project not found", "پروژه یافت نشد", 404);
    }

    // پروژه باید حداقل یک اتاق داشته باشد
    const rooms = await pool.query(
      `
        SELECT id
        FROM rooms
        WHERE project_id = $1
      `,
      [projectId],
    );

    if (rooms.rows.length === 0) {
      throw new AppError("No rooms found for this project", "هیچ اتاقی برای این پروژه وجود ندارد", 400);
    }

    // customer_name پروژه و estimate یکسان باشند
    await pool.query(
      `
        UPDATE projects
        SET customer_name = $1,
            updated_at = NOW()
        WHERE id = $2
      `,
      [data.customerName || null, projectId],
    );

    // ایجاد یا آپدیت estimate
    const result = await pool.query(
      `
        INSERT INTO estimates (
          project_id,
          notes,
          customer_name,
          total_cost,
          total_material_cost,
          accessories_cost,
          paints,
          meterage,
          days,
          visibility
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10
        )

        ON CONFLICT (project_id)
        DO UPDATE SET
          notes = EXCLUDED.notes,
          customer_name = EXCLUDED.customer_name,
          total_cost = EXCLUDED.total_cost,
          total_material_cost = EXCLUDED.total_material_cost,
          accessories_cost = EXCLUDED.accessories_cost,
          paints = EXCLUDED.paints,
          meterage = EXCLUDED.meterage,
          days = EXCLUDED.days,
          visibility = EXCLUDED.visibility,
          updated_at = NOW()

        RETURNING *
      `,
      [
        projectId,
        data.notes || null,
        data.customerName || null,
        data.totalCost,
        data.totalMaterialCost,
        data.accessoriesCost,
        JSON.stringify(data.paints),
        data.meterage,
        data.days,
        JSON.stringify(data.visibility),
      ],
    );

    return mapEstimate(result.rows[0]);
  },

  async findByProject(projectId: string): Promise<EstimateResponse> {
    if (!isValidUUID(projectId)) {
      throw new AppError("Invalid project id", "شناسه پروژه معتبر نیست", 400);
    }

    const result = await pool.query(
      `
        SELECT *
        FROM estimates
        WHERE project_id = $1
      `,
      [projectId],
    );

    if (result.rows.length === 0) {
      throw new AppError("No estimate found for this project", "برآوردی برای این پروژه یافت نشد", 404);
    }

    return mapEstimate(result.rows[0]);
  },

  async calculate(projectId: string, userId: string): Promise<CalculateEstimateResponse> {
    if (!isValidUUID(projectId)) {
      throw new AppError("Invalid project id", "شناسه پروژه معتبر نیست", 400);
    }

    // بررسی پروژه و مالکیت
    const project = await pool.query(
      `
        SELECT id
        FROM projects
        WHERE id = $1
          AND user_id = $2
      `,
      [projectId, userId],
    );

    if (project.rows.length === 0) {
      throw new AppError("Project not found", "پروژه یافت نشد", 404);
    }

    // گرفتن اتاق‌ها
    const roomsResult = await pool.query(
      `
        SELECT *
        FROM rooms
        WHERE project_id = $1
        ORDER BY created_at ASC
      `,
      [projectId],
    );

    if (roomsResult.rows.length === 0) {
      throw new AppError("No rooms found for this project", "هیچ اتاقی برای این پروژه وجود ندارد", 400);
    }

    // قیمت‌ها
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

    // تبدیل مقادیر PostgreSQL به number
    const rooms = roomsResult.rows.map(room => ({
      ...room,
      width: Number(room.width),
      length: Number(room.length),
      height: Number(room.height),
      wall_coats: Number(room.wall_coats),
      ceiling_coats: room.ceiling_coats ? Number(room.ceiling_coats) : undefined,
    }));

    // محاسبه
    const estimate = calculateEstimate(rooms, config);

    // جمع رنگ‌ها
    const paintSummaryMap = new Map<
      "plastic" | "oil" | "acrylic",
      {
        liters: number;
        total_cost: number;
      }
    >();

    const addPaint = (type: "plastic" | "oil" | "acrylic" | null | undefined, liters: number, totalCost: number) => {
      if (!type || liters === 0) {
        return;
      }

      const current = paintSummaryMap.get(type);

      if (current) {
        current.liters += liters;
        current.total_cost += totalCost;
        return;
      }

      paintSummaryMap.set(type, {
        liters,
        total_cost: totalCost,
      });
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

    const finalCost = estimate.base_cost;

    const accessoriesCost = Math.ceil(estimate.accessories_cost / 500_000) * 500_000;

    const totalMaterialsCost = Math.ceil(estimate.total_paint_cost) + accessoriesCost;

    return {
      project_id: projectId,
      has_price_config: !!priceConfigRow,

      calculation: {
        final_cost: finalCost,

        min_total_price: estimate.min_total_price,

        max_total_price: estimate.max_total_price,

        days: estimate.days,

        paint_area: Number(estimate.total_area.toFixed(1)),

        materials: {
          paints,

          accessories_cost: accessoriesCost,

          total_materials_cost: totalMaterialsCost,
        },
      },
    };
  },
};
