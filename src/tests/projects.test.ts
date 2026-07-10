import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";
import { NON_EXISTENT_UUID } from "./setup";
import pool from "../db";

describe("Projects API", () => {
  describe("POST /projects", () => {
    it("should create a project successfully", async () => {
      const res = await request(app).post("/projects").send({ title: "پروژه تست" });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.title).toBe("پروژه تست");
      expect(res.body.data.id).toBeDefined();
    });

    it("should fail if title is missing", async () => {
      const res = await request(app).post("/projects").send({});
      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
    });

    it("should fail if title is too short", async () => {
      const res = await request(app).post("/projects").send({ title: "a" });
      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
    });
  });

  describe("GET /projects", () => {
    it("should return empty array when no projects", async () => {
      const res = await request(app).get("/projects");
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it("should return list of projects", async () => {
      await request(app).post("/projects").send({ title: "پروژه اول" });
      await request(app).post("/projects").send({ title: "پروژه دوم" });

      const res = await request(app).get("/projects");
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });
  });

  describe("GET /projects/:id", () => {
    it("should return project with rooms", async () => {
      const created = await request(app).post("/projects").send({ title: "پروژه تست" });

      const id = created.body.data.id;
      const res = await request(app).get(`/projects/${id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(id);
      expect(res.body.data.rooms).toEqual([]);
    });

    it("should return 404 for non-existent project", async () => {
      const res = await request(app).get(`/projects/${NON_EXISTENT_UUID}`);
      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
    });
  });

  describe("DELETE /projects/:id", () => {
    it("should delete project successfully", async () => {
      const created = await request(app).post("/projects").send({ title: "پروژه تست" });

      const id = created.body.data.id;
      const res = await request(app).delete(`/projects/${id}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    });

    it("should return 404 for non-existent project", async () => {
      const res = await request(app).delete(`/projects/${NON_EXISTENT_UUID}`);
      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
    });
  });
});

describe("Auto cleanup - پروژه‌های بدون اتاق", () => {
  it("پروژه قدیمی بدون اتاق رو حذف کنه", async () => {
    // یه پروژه بساز
    const created = await request(app).post("/projects").send({ title: "پروژه بدون اتاق" });

    const projectId = created.body.data.id;

    // مستقیم توی دیتابیس created_at رو ۱۰ دقیقه قبل کن
    await pool.query("UPDATE projects SET created_at = NOW() - INTERVAL '10 minutes' WHERE id = $1", [projectId]);

    // GET /projects صدا بزن تا cleanup اجرا بشه
    await request(app).get("/projects");

    // چک کن پروژه حذف شده
    const res = await request(app).get(`/projects/${projectId}`);
    expect(res.status).toBe(404);
  });

  it("پروژه جدید بدون اتاق رو حذف نکنه", async () => {
    const created = await request(app).post("/projects").send({ title: "پروژه جدید بدون اتاق" });

    const projectId = created.body.data.id;

    // بلافاصله GET بزن
    await request(app).get("/projects");

    // باید هنوز وجود داشته باشه
    const res = await request(app).get(`/projects/${projectId}`);
    expect(res.status).toBe(200);
  });

  it("پروژه قدیمی با اتاق رو حذف نکنه", async () => {
    const created = await request(app).post("/projects").send({ title: "پروژه با اتاق" });

    const projectId = created.body.data.id;

    // اتاق اضافه کن
    await request(app).post(`/projects/${projectId}/rooms`).send({
      type: "bedroom",
      width: 4,
      length: 5,
      height: 2.8,
      wall_paint_type: "plastic",
      wall_coats: 2,
      ceiling_enabled: false,
    });

    // created_at رو ۱۰ دقیقه قبل کن
    await pool.query("UPDATE projects SET created_at = NOW() - INTERVAL '10 minutes' WHERE id = $1", [projectId]);

    // GET بزن
    await request(app).get("/projects");

    // باید هنوز وجود داشته باشه
    const res = await request(app).get(`/projects/${projectId}`);
    expect(res.status).toBe(200);
  });
});
