import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";
import { NON_EXISTENT_UUID } from "./setup";

const createProject = async () => {
  const estimate = {
    customerName: "پروژه تست",
    notes: "تست",
    totalCost: 5000000,
    totalMaterialCost: 4000000,
    accessoriesCost: 500000,
    paints: {
      plastic: {
        liters: 10,
        total_cost: 7000000,
        price_per_liter: 700000,
      },
      oil: {
        liters: 0,
        total_cost: 0,
        price_per_liter: 850000,
      },
      acrylic: {
        liters: 0,
        total_cost: 0,
        price_per_liter: 950000,
      },
    },
    meterage: 51,
    days: 2,
    visibility: {
      days: true,
      final_cost: true,
      materials: true,
      paint_area: true,
    },
  };

  const roomRes = await request(app).post("/draft/rooms").send({
    type: "bedroom",
    width: 4,
    length: 5,
    height: 2.8,
    wall_paint_type: "plastic",
    wall_coats: 2,
    ceiling_enabled: false,
  });

  console.log("ADD ROOM:", roomRes.status, roomRes.body);

  expect(roomRes.status).toBe(201);

  const res = await request(app).post("/draft/complete").send(estimate);

  console.log("COMPLETE PROJECT:", res.status, res.body);

  expect(res.status).toBe(201);
  expect(res.body.data).toBeDefined();

  return res.body.data;
};

const addRoom = async (
  overrides: Partial<{
    type: string;
    width: number;
    length: number;
    height: number;
    wall_paint_type: string;
    wall_coats: number;
    ceiling_enabled: boolean;
    ceiling_paint_type: string;
    ceiling_coats: number;
  }> = {},
) => {
  const res = await request(app)
    .post(`/draft/rooms`)
    .send({
      type: "bedroom",
      width: 4,
      length: 5,
      height: 2.8,
      wall_paint_type: "plastic",
      wall_coats: 2,
      ceiling_enabled: false,
      ...overrides,
    });

  expect(res.status).toBe(201);

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

describe("Estimates API", () => {
  describe("GET /projects/:project_id/estimates", () => {
    it("should return estimate successfully", async () => {
      const project = await createProject();

      const res = await request(app).get(`/projects/${project.id}/estimates`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data).toBeDefined();
    });

    it("should return the correct project id on the estimate", async () => {
      const project = await createProject();

      const res = await request(app).get(`/projects/${project.id}/estimates`);

      expect(res.status).toBe(200);
      expect(res.body.data.project_id).toBe(project.id);
    });

    it("should return 404 if project does not exist", async () => {
      const res = await request(app).get(`/projects/${NON_EXISTENT_UUID}/estimates`);

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
    });

    it("should return 400 for invalid project id", async () => {
      const res = await request(app).get("/projects/invalid-id/estimates");

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
    });
  });
});

describe("GET /draft/calculate", () => {
  it("should return 400 if no price config exists", async () => {
    await addRoom();

    const res = await request(app).get("/draft/calculate");

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });

  it("should calculate estimate with price config", async () => {
    await addRoom();

    await request(app).put("/price-config").send(priceConfig);

    const res = await request(app).get("/draft/calculate");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");

    expect(res.body.data.has_price_config).toBe(true);

    expect(res.body.data.calculation.final_cost).toBeGreaterThan(0);

    expect(res.body.data.calculation.materials).toBeDefined();

    expect(res.body.data.calculation.materials.paints).toBeDefined();

    expect(res.body.data.calculation.materials.total_materials_cost).toBeGreaterThan(0);
  });

  it("should return 400 if draft has no rooms", async () => {
    // یک draft بدون room می‌سازیم تا شرط "no rooms" (نه "no draft") تست بشود
    await request(app).put("/draft").send({ customer_name: "تست" });

    const res = await request(app).get("/draft/calculate");

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });

  it("should calculate multiple rooms", async () => {
    await addRoom();

    await addRoom({
      type: "living_room",
      width: 6,
      length: 7,
      wall_paint_type: "oil",
      wall_coats: 2,
    });

    await request(app).put("/price-config").send(priceConfig);

    const res = await request(app).get("/draft/calculate");

    expect(res.status).toBe(200);

    expect(res.body.data.calculation.paint_area).toBeGreaterThan(0);
    expect(res.body.data.calculation.days).toBeGreaterThan(0);
  });

  it("should calculate room with ceiling", async () => {
    await addRoom({
      ceiling_enabled: true,
      ceiling_paint_type: "plastic",
      ceiling_coats: 2,
    });

    await request(app).put("/price-config").send(priceConfig);

    const res = await request(app).get("/draft/calculate");

    expect(res.status).toBe(200);

    expect(res.body.data.calculation.paint_area).toBeGreaterThan(0);

    expect(res.body.data.calculation.materials.paints.plastic.liters).toBeGreaterThan(0);
  });

  it("should return paint summary for all paint types", async () => {
    await addRoom({
      wall_paint_type: "plastic",
    });

    await addRoom({
      type: "living_room",
      wall_paint_type: "oil",
    });

    await addRoom({
      type: "kitchen",
      wall_paint_type: "acrylic",
    });

    await request(app).put("/price-config").send(priceConfig);

    const res = await request(app).get("/draft/calculate");

    expect(res.status).toBe(200);

    const paints = res.body.data.calculation.materials.paints;

    expect(paints.plastic).toBeDefined();
    expect(paints.oil).toBeDefined();
    expect(paints.acrylic).toBeDefined();

    expect(paints.plastic.liters).toBeGreaterThan(0);
    expect(paints.oil.liters).toBeGreaterThan(0);
    expect(paints.acrylic.liters).toBeGreaterThan(0);
  });

  it("should return correct price per liter when price config exists", async () => {
    await addRoom({
      wall_paint_type: "plastic",
    });

    await request(app).put("/price-config").send(priceConfig);

    const res = await request(app).get("/draft/calculate");

    expect(res.status).toBe(200);

    const paints = res.body.data.calculation.materials.paints;

    expect(paints.plastic.price_per_liter).toBe(700000);
    expect(paints.oil.price_per_liter).toBe(850000);
    expect(paints.acrylic.price_per_liter).toBe(950000);
  });

  it("should return zero for unused paint types", async () => {
    await addRoom({
      wall_paint_type: "plastic",
    });

    await request(app).put("/price-config").send(priceConfig);

    const res = await request(app).get("/draft/calculate");

    expect(res.status).toBe(200);

    const paints = res.body.data.calculation.materials.paints;

    expect(paints.plastic.liters).toBeGreaterThan(0);

    expect(paints.oil.liters).toBe(0);
    expect(paints.acrylic.liters).toBe(0);
  });

  it("should include minimum and maximum total price", async () => {
    await addRoom();

    await request(app).put("/price-config").send(priceConfig);

    const res = await request(app).get("/draft/calculate");

    expect(res.status).toBe(200);

    const calculation = res.body.data.calculation;

    expect(calculation.min_total_price).toBeDefined();
    expect(calculation.max_total_price).toBeDefined();

    expect(calculation.min_total_price).toBeGreaterThanOrEqual(0);
    expect(calculation.max_total_price).toBeGreaterThanOrEqual(calculation.min_total_price);
  });

  it("should return accessories cost and total materials cost", async () => {
    await addRoom();

    await request(app).put("/price-config").send(priceConfig);

    const res = await request(app).get("/draft/calculate");

    expect(res.status).toBe(200);

    const materials = res.body.data.calculation.materials;

    expect(materials.accessories_cost).toBeDefined();
    expect(materials.total_materials_cost).toBeDefined();

    expect(materials.accessories_cost).toBeGreaterThanOrEqual(0);
    expect(materials.total_materials_cost).toBeGreaterThanOrEqual(0);
  });
});
