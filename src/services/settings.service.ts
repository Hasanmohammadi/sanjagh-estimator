import pool from "../db/index";
import { UpdateSettingsInput } from "../validators/settings.validator";

export const settingsService = {
  async findByUser(userId: string) {
    const result = await pool.query("SELECT * FROM settings WHERE user_id = $1", [userId]);

    if (result.rows.length === 0) {
      return { theme: "light" };
    }

    return result.rows[0];
  },

  async upsert(userId: string, data: UpdateSettingsInput) {
    const result = await pool.query(
      `INSERT INTO settings (user_id, theme)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET
         theme = EXCLUDED.theme,
         updated_at = NOW()
       RETURNING *`,
      [userId, data.theme],
    );

    return result.rows[0];
  },
};
