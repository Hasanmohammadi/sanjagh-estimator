import pool from "../db/index";
import { PriceConfigInput } from "../validators/price-config.validator";

export const priceConfigService = {
  async findByUser(userId: string) {
    const result = await pool.query(
      "SELECT * FROM price_configs WHERE user_id = $1",
      [userId],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  },

  async upsert(userId: string, data: PriceConfigInput) {
    const result = await pool.query(
      `INSERT INTO price_configs (
        user_id, currency,
        plastic_per_liter, plastic_sqm_min, plastic_sqm_max,
        oil_per_liter, oil_sqm_min, oil_sqm_max,
        acrylic_per_liter, acrylic_sqm_min, acrylic_sqm_max
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      ON CONFLICT (user_id) DO UPDATE SET
        currency = EXCLUDED.currency,
        plastic_per_liter = EXCLUDED.plastic_per_liter,
        plastic_sqm_min = EXCLUDED.plastic_sqm_min,
        plastic_sqm_max = EXCLUDED.plastic_sqm_max,
        oil_per_liter = EXCLUDED.oil_per_liter,
        oil_sqm_min = EXCLUDED.oil_sqm_min,
        oil_sqm_max = EXCLUDED.oil_sqm_max,
        acrylic_per_liter = EXCLUDED.acrylic_per_liter,
        acrylic_sqm_min = EXCLUDED.acrylic_sqm_min,
        acrylic_sqm_max = EXCLUDED.acrylic_sqm_max,
        updated_at = NOW()
      RETURNING *`,
      [
        userId,
        data.currency,
        data.plastic_per_liter ?? null,
        data.plastic_sqm_min ?? null,
        data.plastic_sqm_max ?? null,
        data.oil_per_liter ?? null,
        data.oil_sqm_min ?? null,
        data.oil_sqm_max ?? null,
        data.acrylic_per_liter ?? null,
        data.acrylic_sqm_min ?? null,
        data.acrylic_sqm_max ?? null,
      ],
    );

    return result.rows[0];
  },

  // TODO: وقتی API سنجاق اومد پیاده‌سازی کن
  async fetchFromSanjagh(): Promise<PriceConfigInput> {
    throw new Error("Sanjagh API not implemented yet");
  },
};
