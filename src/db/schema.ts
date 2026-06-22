import pool from "./index";

const createTables = async (): Promise<void> => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id          SERIAL PRIMARY KEY,
      title       VARCHAR(255) NOT NULL,
      created_at  TIMESTAMP DEFAULT NOW(),
      updated_at  TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id                  SERIAL PRIMARY KEY,
      project_id          INTEGER REFERENCES projects(id) ON DELETE CASCADE,
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

    CREATE TABLE IF NOT EXISTS estimates (
      id                    SERIAL PRIMARY KEY,
      project_id            INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      with_materials        BOOLEAN DEFAULT TRUE,
      slider_value          NUMERIC(4,2) DEFAULT 1.0,
      paint_prices          JSONB,
      customer_name         VARCHAR(255),
      notes                 TEXT,
      created_at            TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log("Tables created successfully");
};

export default createTables;
