import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

const createProject = async () => {
  const res = await request(app).post("/projects").send({ title: "پروژه تست" });
  return res.body.data;
};

const addRoom = async (projectId: number) => {
  const res = await request(app).post(`/projects/${projectId}/rooms`).send({
    type: "bedroom",
    width: 4,
    length: 5,
    height: 2.8,
    wall_paint_type: "plastic",
    wall_coats: 2,
    ceiling_enabled: false,
  });
  return res.body.data;
};

const validEstimate = {
  paint_prices: {
    plastic: 700000,
    oil: 850000,
    acrylic: 950000,
  },
  labor_price_per_sqm: 150000,
  with_materials: true,
  slider_value: 1.0,
  customer_name: "ایمان نجاتی",
  notes: "تست",
};

describe("Estimates API", () => {
  describe("POST /projects/:project_id/estimates", () => {
    it("should create estimate successfully", async () => {
      const project = await createProject();
      await addRoom(project.id);

      const res = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send(validEstimate);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.calculation).toBeDefined();
      expect(res.body.data.calculation.final_cost).toBeGreaterThan(0);
    });

    it("should return 404 if project not found", async () => {
      const res = await request(app)
        .post("/projects/9999/estimates")
        .send(validEstimate);

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
    });

    it("should return 400 if no rooms exist", async () => {
      const project = await createProject();

      const res = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send(validEstimate);

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
    });

    it("should reject invalid slider_value", async () => {
      const project = await createProject();
      await addRoom(project.id);

      const res = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send({ ...validEstimate, slider_value: 2.0 });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
    });

    it("بدون مصالح فقط اجرت حساب کنه", async () => {
      const project = await createProject();
      await addRoom(project.id);

      const withMaterials = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send({ ...validEstimate, with_materials: true });

      const withoutMaterials = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send({ ...validEstimate, with_materials: false });

      expect(withMaterials.body.data.calculation.final_cost).toBeGreaterThan(
        withoutMaterials.body.data.calculation.final_cost,
      );
    });

    it("اسلایدر روی اجرت تاثیر بذاره نه رنگ", async () => {
      const project = await createProject();
      await addRoom(project.id);

      const slider1 = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send({ ...validEstimate, slider_value: 1.0 });

      const slider12 = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send({ ...validEstimate, slider_value: 1.2 });

      const cost1 = slider1.body.data.calculation;
      const cost12 = slider12.body.data.calculation;

      // قیمت رنگ نباید تغییر کنه
      expect(cost1.total_paint_cost).toBe(cost12.total_paint_cost);

      // قیمت نهایی باید تغییر کنه
      expect(cost12.final_cost).toBeGreaterThan(cost1.final_cost);
    });

    it("چند اتاق رو با هم حساب کنه", async () => {
      const project = await createProject();
      await addRoom(project.id);
      await addRoom(project.id);

      const res = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send(validEstimate);

      expect(res.body.data.calculation.rooms).toHaveLength(2);
      expect(res.body.data.calculation.total_area).toBeGreaterThan(0);
    });
  });

  describe("GET /projects/:project_id/estimates", () => {
    it("should return latest estimate", async () => {
      const project = await createProject();
      await addRoom(project.id);

      await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send(validEstimate);

      const res = await request(app).get(`/projects/${project.id}/estimates`);

      expect(res.status).toBe(200);
      expect(res.body.data.project_id).toBe(project.id);
    });

    it("should return 404 if no estimate exists", async () => {
      const project = await createProject();

      const res = await request(app).get(`/projects/${project.id}/estimates`);

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
    });
  });
});
