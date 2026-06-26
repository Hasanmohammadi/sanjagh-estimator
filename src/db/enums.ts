import pool from "./index";

export async function createEnums() {
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'room_type'
      ) THEN
        CREATE TYPE room_type AS ENUM (
          'bedroom',
          'living_room',
          'bathroom',
          'kitchen',
          'hallway',
          'other'
        );
      END IF;
    END
    $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'paint_type'
      ) THEN
        CREATE TYPE paint_type AS ENUM (
          'acrylic',
          'oil_based',
          'plastic_emulsion'
        );
      END IF;
    END
    $$;
  `);
}
