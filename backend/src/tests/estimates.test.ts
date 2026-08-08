import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";
import { NON_EXISTENT_UUID } from "./setup";

const createProject = async () => {
  const res = await request(app).post("/projects").send({ title: "پروژه تست" });
  return res.body.data;
};

const addRoom = async (projectId: string) => {
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

const priceConfig = {
  currency: "تومان",
  plastic_per_liter: 700000,
  oil_per_liter: 850000,
  acrylic_per_liter: 950000,
  plastic_without_min: 400000,
  plastic_without_max: 800000,
  oil_without_min: 500000,
  oil_without_max: 950000,
  acrylic_without_min: 600000,
  acrylic_without_max: 1100000,
};

const validEstimate = {
  customerName: "ایمان نجاتی",
  notes: "تست",
  totalCost: 5000000,
  totalMaterialCost: 5000000,
  accessoriesCost: 500000,
  paints: {
    plastic: { liters: 12, total_cost: 8400000, price_per_liter: 700000 },
    oil: { liters: 0, total_cost: 0, price_per_liter: 850000 },
    acrylic: { liters: 0, total_cost: 0, price_per_liter: 950000 },
  },
  meterage: 51,
  days: 1,
  visibility: {
    days: true,
    final_cost: true,
    materials: true,
    paint_area: true,
  },
};

describe("Estimates API", () => {
  describe("POST /projects/:project_id/estimates", () => {
    it("should create estimate successfully", async () => {
      const project = await createProject();
      await addRoom(project.id);

      const res = await request(app).post(`/projects/${project.id}/estimates`).send(validEstimate);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data).toBeDefined();
    });

    it("should return 404 if project not found", async () => {
      const res = await request(app).post(`/projects/${NON_EXISTENT_UUID}/estimates`).send(validEstimate);

      expect(res.status).toBe(404);
    });

    it("should return 400 if no rooms exist", async () => {
      const project = await createProject();
      const res = await request(app).post(`/projects/${project.id}/estimates`).send(validEstimate);

      expect(res.status).toBe(400);
    });

    it("notes ذخیره بشه", async () => {
      const project = await createProject();
      await addRoom(project.id);

      const res = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send({ ...validEstimate, notes: "تست نوت" });

      expect(res.body.data.notes).toBe("تست نوت");
    });

    it("customerName ذخیره بشه", async () => {
      const project = await createProject();
      await addRoom(project.id);

      const res = await request(app).post(`/projects/${project.id}/estimates`).send(validEstimate);

      expect(res.body.data.customerName).toBe("ایمان نجاتی");
    });

    it("paints ذخیره بشه", async () => {
      const project = await createProject();
      await addRoom(project.id);

      const res = await request(app).post(`/projects/${project.id}/estimates`).send(validEstimate);

      expect(res.body.data.paints.plastic.liters).toBe(12);
      expect(res.body.data.paints.oil.liters).toBe(0);
      expect(res.body.data.paints.acrylic.liters).toBe(0);
    });

    it("visibility ذخیره بشه", async () => {
      const project = await createProject();
      await addRoom(project.id);

      const res = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send({ ...validEstimate, visibility: { ...validEstimate.visibility, days: false } });

      expect(res.body.data.visibility.days).toBe(false);
      expect(res.body.data.visibility.final_cost).toBe(true);
    });

    it("totalCost ذخیره بشه", async () => {
      const project = await createProject();
      await addRoom(project.id);

      const res = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send({ ...validEstimate, totalCost: 2500000 });

      expect(res.body.data.totalCost).toBe(2500000);
    });

    it("دوباره ذخیره کنه (upsert)", async () => {
      const project = await createProject();
      await addRoom(project.id);

      await request(app).post(`/projects/${project.id}/estimates`).send(validEstimate);

      const updated = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send({ ...validEstimate, totalCost: 9990000 });

      expect(updated.body.data.totalCost).toBe(9990000);
    });
  });

  describe("GET /projects/:project_id/estimates", () => {
    it("should return latest estimate", async () => {
      const project = await createProject();
      await addRoom(project.id);

      await request(app).post(`/projects/${project.id}/estimates`).send(validEstimate);

      const res = await request(app).get(`/projects/${project.id}/estimates`);

      expect(res.status).toBe(200);
      expect(res.body.data.project_id).toBe(project.id);
    });

    it("should return 404 if no estimate exists", async () => {
      const project = await createProject();
      const res = await request(app).get(`/projects/${project.id}/estimates`);
      expect(res.status).toBe(404);
    });
  });
});

describe("GET /projects/:project_id/estimates/calculate", () => {
  it("بدون price config محاسبه کنه", async () => {
    const project = await createProject();
    await addRoom(project.id);

    const res = await request(app).get(`/projects/${project.id}/estimates/calculate`);

    expect(res.status).toBe(200);
    expect(res.body.data.has_price_config).toBe(false);
    expect(res.body.data.calculation.paint_area).toBeGreaterThan(0);
    expect(res.body.data.calculation.days).toBeGreaterThan(0);
  });

  it("با price config محاسبه کنه", async () => {
    const project = await createProject();
    await addRoom(project.id);
    await request(app).put("/price-config").send(priceConfig);

    const res = await request(app).get(`/projects/${project.id}/estimates/calculate`);

    expect(res.status).toBe(200);
    expect(res.body.data.has_price_config).toBe(true);
    expect(res.body.data.calculation.final_cost).toBeGreaterThan(0);
  });

  it("اگه پروژه وجود نداشته باشه ۴۰۴ بده", async () => {
    const res = await request(app).get(`/projects/${NON_EXISTENT_UUID}/estimates/calculate`);

    expect(res.status).toBe(404);
    expect(res.body.status).toBe("error");
  });

  it("اگه اتاقی نداشته باشه ۴۰۰ بده", async () => {
    const project = await createProject();

    const res = await request(app).get(`/projects/${project.id}/estimates/calculate`);

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });

  it("چند اتاق رو با هم حساب کنه", async () => {
    const project = await createProject();
    await addRoom(project.id);
    await addRoom(project.id);

    const res = await request(app).get(`/projects/${project.id}/estimates/calculate`);

    expect(res.body.data.calculation.paint_area).toBeGreaterThan(0);
    expect(res.body.data.calculation.days).toBeGreaterThan(0);
  });
});
