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

const validEstimate = {
  with_materials: true,
  customer_name: "ایمان نجاتی",
  notes: "تست",
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

describe("Estimates API", () => {
  describe("POST /projects/:project_id/estimates", () => {
    it("should create estimate successfully", async () => {
      const project = await createProject();
      await addRoom(project.id);
      await request(app).put("/price-config").send(priceConfig);

      const res = await request(app).post(`/projects/${project.id}/estimates`).send(validEstimate);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.calculation).toBeDefined();
      expect(res.body.data.calculation.final_cost).toBeGreaterThan(0);
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

    it("با مصالح از بدون مصالح گرون‌تر باشه", async () => {
      const project = await createProject();
      await addRoom(project.id);
      await request(app).put("/price-config").send(priceConfig);

      const withMat = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send({ ...validEstimate, with_materials: true });

      const withoutMat = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send({ ...validEstimate, with_materials: false });

      expect(withMat.body.data.calculation.final_cost).toBeGreaterThan(withoutMat.body.data.calculation.final_cost);
    });

    it("چند اتاق رو با هم حساب کنه", async () => {
      const project = await createProject();
      await addRoom(project.id);
      await addRoom(project.id);

      const res = await request(app).post(`/projects/${project.id}/estimates`).send(validEstimate);

      expect(res.body.data.calculation.paint_area).toBeGreaterThan(0);
    });

    it("notes ذخیره بشه", async () => {
      const project = await createProject();
      await addRoom(project.id);

      const res = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send({ ...validEstimate, notes: "تست" });

      expect(res.body.data.notes).toBe("تست");
    });

    it("paints به صورت object با سه کلید باشه", async () => {
      const project = await createProject();
      await addRoom(project.id);
      await request(app).put("/price-config").send(priceConfig);

      const res = await request(app).post(`/projects/${project.id}/estimates`).send(validEstimate);

      const paints = res.body.data.calculation.materials.paints;
      expect(paints).toBeDefined();
      expect(paints.plastic).toBeDefined();
      expect(paints.oil).toBeDefined();
      expect(paints.acrylic).toBeDefined();
    });

    it("paints لیتر و هزینه و قیمت هر لیتر داشته باشه", async () => {
      const project = await createProject();
      await addRoom(project.id);
      await request(app).put("/price-config").send(priceConfig);

      const res = await request(app).post(`/projects/${project.id}/estimates`).send(validEstimate);

      const plastic = res.body.data.calculation.materials.paints.plastic;
      expect(plastic.liters).toBeGreaterThan(0);
      expect(plastic.total_cost).toBeGreaterThan(0);
      expect(plastic.price_per_liter).toBe(700000);
    });

    it("رنگ‌هایی که استفاده نشدن صفر باشن", async () => {
      const project = await createProject();
      await addRoom(project.id);
      await request(app).put("/price-config").send(priceConfig);

      const res = await request(app).post(`/projects/${project.id}/estimates`).send(validEstimate);

      const paints = res.body.data.calculation.materials.paints;
      expect(paints.oil.liters).toBe(0);
      expect(paints.acrylic.liters).toBe(0);
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

  it("با with_materials=false قیمت کمتر باشه", async () => {
    const project = await createProject();
    await addRoom(project.id);
    await request(app).put("/price-config").send(priceConfig);

    const withMat = await request(app).get(`/projects/${project.id}/estimates/calculate?with_materials=true`);
    const withoutMat = await request(app).get(`/projects/${project.id}/estimates/calculate?with_materials=false`);

    expect(withMat.body.data.calculation.final_cost).toBeGreaterThan(withoutMat.body.data.calculation.final_cost);
  });

  it("slider روی قیمت رنگ تاثیر نذاره", async () => {
    const project = await createProject();
    await addRoom(project.id);
    await request(app).put("/price-config").send(priceConfig);

    const slider1 = await request(app).get(`/projects/${project.id}/estimates/calculate?slider_value=1.0`);
    const slider12 = await request(app).get(`/projects/${project.id}/estimates/calculate?slider_value=1.2`);

    expect(slider1.body.data.calculation.total_paint_cost).toBe(slider12.body.data.calculation.total_paint_cost);
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
