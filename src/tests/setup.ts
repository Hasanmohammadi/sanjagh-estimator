import { beforeAll, afterAll, beforeEach } from "vitest";
import pool from "../db/index";
import createTables from "../db/schema";

export const TEST_USER_ID = "00000000-0000-0000-0000-000000000001";
export const NON_EXISTENT_UUID = "00000000-0000-0000-0000-000000000000";

beforeAll(async () => {
  await createTables();
});

beforeEach(async () => {
  await pool.query(`
    TRUNCATE TABLE
      estimates,
      rooms,
      projects,
      price_configs
    RESTART IDENTITY CASCADE;
  `);
});

afterAll(async () => {
  await pool.end();
});
