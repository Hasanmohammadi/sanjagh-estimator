import pool from "../db/index";
import { AppError } from "../utils/apiResponse";
import { UpdateDraftInput, DraftRoom } from "../validators/draft.validator";
import { CreateEstimateInput } from "../validators/estimate.validator";
import { calculateEstimate, PriceConfig } from "../utils/calculate";
import { priceConfigService } from "./price-config.service";
import { isValidUUID } from "../utils/uuid";

export const draftService = {
  async findByUser(userId: string) {
    const result = await pool.query("SELECT * FROM drafts WHERE user_id = $1", [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  },

  async upsert(userId: string, data: UpdateDraftInput) {
    const result = await pool.query(
      `
        INSERT INTO drafts (
          user_id,
          customer_name
        )
        VALUES ($1, $2)

        ON CONFLICT (user_id)
        DO UPDATE SET
          customer_name = COALESCE(
            EXCLUDED.customer_name,
            drafts.customer_name
          ),
          updated_at = NOW()

        RETURNING *
      `,
      [userId, data.customer_name ?? null],
    );

    return result.rows[0];
  },

  async clear(userId: string) {
    await pool.query("DELETE FROM drafts WHERE user_id = $1", [userId]);
  },

  async calculate(userId: string) {
    const draft = await this.findByUser(userId);

    if (!draft) {
      throw new AppError("No draft found", "پیش‌نویس یافت نشد", 404);
    }

    if (!draft.rooms || draft.rooms.length === 0) {
      throw new AppError("Draft has no rooms", "پیش‌نویس اتاقی ندارد", 400);
    }

    const priceConfigRow = await priceConfigService.findByUser(userId);

    if (!priceConfigRow) {
      throw new AppError("No price config found", "تنظیمات قیمت یافت نشد", 400);
    }

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

    const rooms = draft.rooms.map((room: DraftRoom) => ({
      ...room,

      width: Number(room.width),
      length: Number(room.length),
      height: Number(room.height),

      wall_coats: Number(room.wall_coats),

      ceiling_coats: room.ceiling_coats ? Number(room.ceiling_coats) : undefined,
    }));

    const estimate = calculateEstimate(rooms, config);

    const paintSummaryMap = new Map<
      "plastic" | "oil" | "acrylic",
      {
        liters: number;
        total_cost: number;
      }
    >();

    estimate.rooms.forEach((roomEstimate, index) => {
      const room = rooms[index];

      const addPaint = (type: "plastic" | "oil" | "acrylic" | null | undefined, liters: number, totalCost: number) => {
        if (!type || liters === 0) {
          return;
        }

        const current = paintSummaryMap.get(type);

        if (current) {
          current.liters += liters;
          current.total_cost += totalCost;
        } else {
          paintSummaryMap.set(type, {
            liters,
            total_cost: totalCost,
          });
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

    return {
      has_price_config: !!priceConfigRow,

      draft_customer_name: draft.customer_name,

      rooms: draft.rooms,

      calculation: {
        final_cost: estimate.base_cost,
        min_total_price: estimate.min_total_price,
        max_total_price: estimate.max_total_price,
        days: estimate.days,
        paint_area: Number(estimate.total_area.toFixed(1)),
        total_paint_cost: estimate.total_paint_cost,

        materials: {
          paints,

          accessories_cost: estimate.accessories_cost,

          total_materials_cost: estimate.total_paint_cost + estimate.accessories_cost,
        },
      },
    };
  },

  async complete(userId: string, estimateData: CreateEstimateInput) {
    const draft = await this.findByUser(userId);

    if (!draft) {
      throw new AppError("No draft found", "پیش‌نویس یافت نشد", 404);
    }

    if (!draft.rooms || draft.rooms.length === 0) {
      throw new AppError("Draft has no rooms", "پیش‌نویس اتاقی ندارد", 400);
    }

    const customerName = estimateData.customerName ?? draft.customer_name ?? null;

    // ۱. ساخت پروژه
    const project = await pool.query(
      `
        INSERT INTO projects (
          user_id,
          customer_name
        )
        VALUES ($1, $2)
        RETURNING *
      `,
      [userId, customerName],
    );

    const projectId = project.rows[0].id;

    try {
      // ۲. کپی اتاق‌ها از Draft به Project
      for (const room of draft.rooms) {
        await pool.query(
          `
            INSERT INTO rooms (
              project_id,
              type,
              width,
              length,
              height,
              wall_paint_type,
              wall_coats,
              ceiling_enabled,
              ceiling_paint_type,
              ceiling_coats
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
          `,
          [
            projectId,
            room.type,
            room.width,
            room.length,
            room.height,
            room.wall_paint_type,
            room.wall_coats,
            room.ceiling_enabled,
            room.ceiling_paint_type || null,
            room.ceiling_coats || null,
          ],
        );
      }

      // ۳. ذخیره Estimate
      await pool.query(
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
        `,
        [
          projectId,
          estimateData.notes || null,
          customerName,

          estimateData.totalCost,
          estimateData.totalMaterialCost,
          estimateData.accessoriesCost,

          JSON.stringify(estimateData.paints),

          estimateData.meterage,
          estimateData.days,

          JSON.stringify(estimateData.visibility),
        ],
      );

      // ۴. حذف Draft بعد از تکمیل موفق پروژه
      await this.clear(userId);

      return project.rows[0];
    } catch (err) {
      // اگر هر مرحله‌ای fail شد، پروژه ساخته‌شده حذف شود
      await pool.query("DELETE FROM projects WHERE id = $1", [projectId]);

      throw err;
    }
  },

  async fromProject(userId: string, projectId: string) {
    if (!isValidUUID(projectId)) {
      throw new AppError("Invalid project id", "شناسه پروژه معتبر نیست", 400);
    }

    const project = await pool.query(
      `
        SELECT *
        FROM projects
        WHERE id = $1
        AND user_id = $2
      `,
      [projectId, userId],
    );

    if (project.rows.length === 0) {
      throw new AppError("Project not found", "پروژه یافت نشد", 404);
    }

    const rooms = await pool.query(
      `
        SELECT
          gen_random_uuid() AS id,
          type,
          width,
          length,
          height,
          wall_paint_type,
          wall_coats,
          ceiling_enabled,
          ceiling_paint_type,
          ceiling_coats
        FROM rooms
        WHERE project_id = $1
      `,
      [projectId],
    );

    const result = await pool.query(
      `
        INSERT INTO drafts (
          user_id,
          customer_name,
          rooms
        )
        VALUES (
          $1,
          $2,
          $3::jsonb
        )

        ON CONFLICT (user_id)
        DO UPDATE SET
          customer_name = EXCLUDED.customer_name,
          rooms = EXCLUDED.rooms,
          updated_at = NOW()

        RETURNING *
      `,
      [userId, project.rows[0].customer_name, JSON.stringify(rooms.rows)],
    );

    return result.rows[0];
  },
};
