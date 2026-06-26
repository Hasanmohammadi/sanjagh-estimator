import pool from "./index";

const createTables = async (): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title       VARCHAR(255) NOT NULL,
        created_at  TIMESTAMP DEFAULT NOW(),
        updated_at  TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id          UUID REFERENCES projects(id) ON DELETE CASCADE, -- CHANGED INTEGER TO UUID HERE
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
        project_id     UUID REFERENCES projects(id) ON DELETE CASCADE, -- CHANGED INTEGER TO UUID HERE
        with_materials BOOLEAN DEFAULT TRUE,
        slider_value   NUMERIC(4,2) DEFAULT 1.0,
        paint_prices   JSONB,
        customer_name  VARCHAR(255),
        notes          TEXT,
        created_at     TIMESTAMP DEFAULT NOW()
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
