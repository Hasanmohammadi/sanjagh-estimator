import { beforeAll, afterAll, beforeEach } from "vitest";
import pool from "../db/index";
import createTables from "../db/schema";

beforeAll(async () => {
  await createTables();
});

beforeEach(async () => {
  await pool.query(`
    TRUNCATE TABLE
      estimates,
      rooms,
      projects
    RESTART IDENTITY CASCADE;
  `);
});

afterAll(async () => {
  await pool.end();
});
