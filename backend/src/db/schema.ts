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
        created_at    TIMESTAMP DEFAULT NOW(),
        updated_at    TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id          UUID REFERENCES projects(id) ON DELETE CASCADE,
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
        project_id          UUID REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
        id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_name       TEXT,
        notes               TEXT,
        total_material_cost NUMERIC(12,2),
        total_cost          NUMERIC(12,2),
        paints              JSONB,
        accessories_cost    NUMERIC(12,2),
        days                INTEGER,
        meterage            NUMERIC(10,2),
        created_at          TIMESTAMP DEFAULT NOW(),
        visibility          JSONB DEFAULT '{"final_cost":true,"days":true,"paint_area":true,"materials":true,"accessories":true,"paints":true}',
        updated_at          TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS price_configs (
        id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id              UUID NOT NULL UNIQUE,
        currency             VARCHAR(10) NOT NULL DEFAULT 'تومان',
        plastic_per_liter    NUMERIC(12,2),
        oil_per_liter        NUMERIC(12,2),
        acrylic_per_liter    NUMERIC(12,2),
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

    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id    UUID NOT NULL UNIQUE,
        theme      VARCHAR(20) NOT NULL DEFAULT 'simple',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
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
