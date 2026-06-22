import { beforeAll, afterAll, beforeEach } from "vitest";
import pool from "../db/index";
import createTables from "../db/schema";

beforeAll(async () => {
  await createTables();
});

beforeEach(async () => {
  await pool.query("DELETE FROM rooms");
  await pool.query("DELETE FROM projects");
  await pool.query("ALTER SEQUENCE projects_id_seq RESTART WITH 1");
  await pool.query("ALTER SEQUENCE rooms_id_seq RESTART WITH 1");
});

afterAll(async () => {
  await pool.end();
});
