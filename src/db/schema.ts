import pool from "./index";

const createTables = async (): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id       UUID NOT NULL,
        title         VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255),
        meterage      NUMERIC(10,2),
        created_at    TIMESTAMP DEFAULT NOW(),
        updated_at    TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id          UUID REFERENCES projects(id) ON DELETE CASCADE,
        user_id             UUID NOT NULL,
        type                VARCHAR(50) NOT NULL,
        width               NUMERIC(5,2) NOT NULL,
        length              NUMERIC(5,2) NOT NULL,
        height              NUMERIC(5,2) NOT NULL DEFAULT 2.8,
        wall_paint_type     VARCHAR(20) NOT NULL,
        wall_coats          INTEGER NOT NULL DEFAULT 2,
        ceiling_enabled     BOOLEAN DEFAULT FALSE,
        ceiling_paint_type  VARCHAR(20),
        ceiling_coats       INTEGER,
        created_at          TIMESTAMP DEFAULT NOW(),
        updated_at          TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS estimates (
        id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id     UUID REFERENCES projects(id) ON DELETE CASCADE,
        with_materials BOOLEAN DEFAULT TRUE,
        paint_prices   JSONB,
        customer_name  VARCHAR(255),
        notes          TEXT,
        created_at     TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS price_configs (
        id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id              UUID NOT NULL UNIQUE,
        currency             VARCHAR(10) NOT NULL DEFAULT 'تومان',

        -- قیمت هر لیتر رنگ
        plastic_per_liter    NUMERIC(12,2),
        oil_per_liter        NUMERIC(12,2),
        acrylic_per_liter    NUMERIC(12,2),

        -- قیمت بدون مصالح هر متر مربع
        plastic_without_min  NUMERIC(12,2),
        plastic_without_max  NUMERIC(12,2),
        oil_without_min      NUMERIC(12,2),
        oil_without_max      NUMERIC(12,2),
        acrylic_without_min  NUMERIC(12,2),
        acrylic_without_max  NUMERIC(12,2),

        created_at           TIMESTAMP DEFAULT NOW(),
        updated_at           TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query("COMMIT");
    console.log("Tables created successfully");
  } catch (err: any) {
    await client.query("ROLLBACK");
    if (err.code === "42P07" || err.code === "23505") {
      console.log("Tables already exist, skipping...");
      return;
    }
    throw err;
  } finally {
    client.release();
  }
};

export default createTables;
