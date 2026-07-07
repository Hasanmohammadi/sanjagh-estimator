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
  paint_prices: {
    plastic_with: 800000,
    plastic_without: 500000,
    oil_with: 950000,
    oil_without: 600000,
    acrylic_with: 1050000,
    acrylic_without: 700000,
  },
  paint_price_per_liter: {
    plastic: 700000,
    oil: 850000,
    acrylic: 950000,
  },
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

    it("should reject slider_value above 1.2", async () => {
      const project = await createProject();
      await addRoom(project.id);

      const res = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send({ ...validEstimate, slider_value: 1.5 });

      expect(res.status).toBe(400);
    });

    it("should reject slider_value below 0.8", async () => {
      const project = await createProject();
      await addRoom(project.id);

      const res = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send({ ...validEstimate, slider_value: 0.5 });

      expect(res.status).toBe(400);
    });

    it("با مصالح از بدون مصالح گرون‌تر باشه", async () => {
      const project = await createProject();
      await addRoom(project.id);

      const withMat = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send({ ...validEstimate, with_materials: true });

      const withoutMat = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send({ ...validEstimate, with_materials: false });

      expect(withMat.body.data.calculation.final_cost).toBeGreaterThan(withoutMat.body.data.calculation.final_cost);
    });

    it("اسلایدر ۱.۲ قیمت نهایی رو بیشتر از ۱.۰ کنه", async () => {
      const project = await createProject();
      await addRoom(project.id);

      const slider1 = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send({ ...validEstimate, slider_value: 1.0 });

      const slider12 = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send({ ...validEstimate, slider_value: 1.2 });

      expect(slider12.body.data.calculation.final_cost).toBeGreaterThan(slider1.body.data.calculation.final_cost);
    });

    it("اسلایدر روی قیمت رنگ تاثیر نذاره", async () => {
      const project = await createProject();
      await addRoom(project.id);

      const slider1 = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send({ ...validEstimate, slider_value: 1.0 });

      const slider12 = await request(app)
        .post(`/projects/${project.id}/estimates`)
        .send({ ...validEstimate, slider_value: 1.2 });

      expect(slider1.body.data.calculation.total_paint_cost).toBe(slider12.body.data.calculation.total_paint_cost);
    });

    it("چند اتاق رو با هم حساب کنه", async () => {
      const project = await createProject();
      await addRoom(project.id);
      await addRoom(project.id);

      const res = await request(app).post(`/projects/${project.id}/estimates`).send(validEstimate);

      expect(res.body.data.calculation.paint_area).toBeGreaterThan(0);
      expect(res.body.data.calculation.materials.paints.length).toBeGreaterThan(0);
    });

    it("اطلاعات مشتری ذخیره بشه", async () => {
      const project = await createProject();
      await addRoom(project.id);

      const res = await request(app).post(`/projects/${project.id}/estimates`).send(validEstimate);

      expect(res.body.data.customer_name).toBe("ایمان نجاتی");
      expect(res.body.data.notes).toBe("تست");
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
    expect(res.body.status).toBe("success");
    expect(res.body.data.has_price_config).toBe(false);

    expect(res.body.data.calculation.paint_area).toBeGreaterThan(0);
    expect(res.body.data.calculation.days).toBeGreaterThan(0);

    expect(res.body.data.calculation.materials).toBeDefined();
  });

  it("با price config محاسبه کنه", async () => {
    const project = await createProject();
    await addRoom(project.id);

    await request(app).put("/price-config").send({
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
    });

    const res = await request(app).get(`/projects/${project.id}/estimates/calculate`);

    expect(res.status).toBe(200);
    expect(res.body.data.has_price_config).toBe(true);

    expect(res.body.data.calculation.final_cost).toBeGreaterThan(0);

    expect(res.body.data.calculation.materials.accessories_cost).toBeGreaterThan(0);

    expect(res.body.data.calculation.materials.total_materials_cost).toBeGreaterThan(0);
  });

  it("با with_materials=false اجرت کمتر باشه", async () => {
    const project = await createProject();
    await addRoom(project.id);

    await request(app).put("/price-config").send({
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
    });

    const withMat = await request(app).get(`/projects/${project.id}/estimates/calculate?with_materials=true`);
    const withoutMat = await request(app).get(`/projects/${project.id}/estimates/calculate?with_materials=false`);

    expect(withMat.body.data.calculation.final_cost).toBeGreaterThan(withoutMat.body.data.calculation.final_cost);
  });

  it("slider_value روی final_cost تاثیر بذاره", async () => {
    const project = await createProject();
    await addRoom(project.id);

    await request(app).put("/price-config").send({
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
    });

    const slider1 = await request(app).get(`/projects/${project.id}/estimates/calculate?slider_value=1.0`);
    const slider12 = await request(app).get(`/projects/${project.id}/estimates/calculate?slider_value=1.2`);

    expect(slider12.body.data.calculation.final_cost).toBeGreaterThan(slider1.body.data.calculation.final_cost);
  });

  it("slider روی قیمت رنگ تاثیر نذاره", async () => {
    const project = await createProject();
    await addRoom(project.id);

    await request(app).put("/price-config").send({
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
    });

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

    expect(res.body.data.calculation.materials.paints.length).toBeGreaterThan(0);
  });
});

it("paint_summary را برگرداند", async () => {
  const project = await createProject();
  await addRoom(project.id);

  const res = await request(app).post(`/projects/${project.id}/estimates`).send(validEstimate);

  expect(res.status).toBe(201);

  expect(res.body.data.calculation.materials.paints).toBeDefined();

  expect(Array.isArray(res.body.data.calculation.materials.paints)).toBe(true);

  expect(res.body.data.calculation.materials.paints.length).toBeGreaterThan(0);
});

it("paint_summary مجموع لیتر هر رنگ را درست محاسبه کند", async () => {
  const project = await createProject();
  await addRoom(project.id);

  const res = await request(app).post(`/projects/${project.id}/estimates`).send(validEstimate);

  const summary = res.body.data.calculation.materials.paints;

  const totalLiters = summary.reduce((sum: number, item: any) => sum + item.liters, 0);

  expect(totalLiters).toBeGreaterThan(0);
});

it("paint_summary مجموع هزینه رنگ را درست محاسبه کند", async () => {
  const project = await createProject();
  await addRoom(project.id);

  const res = await request(app).post(`/projects/${project.id}/estimates`).send(validEstimate);

  const summary = res.body.data.calculation.materials.paints;

  const totalCost = summary.reduce((sum: number, item: any) => sum + item.total_cost, 0);

  expect(totalCost).toBeGreaterThan(0);

  expect(totalCost).toBeLessThanOrEqual(res.body.data.calculation.materials.total_materials_cost);
});
