import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

const validPriceConfig = {
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

describe("Price Config API", () => {
  describe("GET /price-config", () => {
    it("اگه config نداشت null برگردونه", async () => {
      const res = await request(app).get("/price-config");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data).toBeNull();
    });

    it("بعد از ذخیره، config رو برگردونه", async () => {
      await request(app).put("/price-config").send(validPriceConfig);
      const res = await request(app).get("/price-config");

      expect(res.status).toBe(200);
      expect(Number(res.body.data.plastic_per_liter)).toBe(700000);
      expect(res.body.data.currency).toBe("تومان");
    });
  });

  describe("PUT /price-config", () => {
    it("config رو ذخیره کنه", async () => {
      const res = await request(app).put("/price-config").send(validPriceConfig);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.user_id).toBeDefined();
      expect(Number(res.body.data.plastic_per_liter)).toBe(700000);
    });

    it("دوبار ذخیره کنه (upsert)", async () => {
      await request(app).put("/price-config").send(validPriceConfig);

      const updated = await request(app)
        .put("/price-config")
        .send({ ...validPriceConfig, plastic_per_liter: 900000 });

      expect(updated.status).toBe(200);
      expect(Number(updated.body.data.plastic_per_liter)).toBe(900000);
    });

    it("اگه قیمت منفی باشه خطا بده", async () => {
      const res = await request(app)
        .put("/price-config")
        .send({ ...validPriceConfig, plastic_per_liter: -1000 });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
    });

    it("اگه قیمت کمتر از ۱۰۰۰ باشه خطا بده", async () => {
      const res = await request(app)
        .put("/price-config")
        .send({ ...validPriceConfig, plastic_per_liter: 500 });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
    });

    it("اگه قیمت بیشتر از ۱۰۰ میلیون باشه خطا بده", async () => {
      const res = await request(app)
        .put("/price-config")
        .send({ ...validPriceConfig, plastic_per_liter: 200_000_000 });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
    });

    it("اگه min بیشتر از max باشه خطا بده", async () => {
      const res = await request(app)
        .put("/price-config")
        .send({ ...validPriceConfig, plastic_without_min: 900000, plastic_without_max: 500000 });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
    });

    it("اگه min مساوی max باشه خطا بده", async () => {
      const res = await request(app)
        .put("/price-config")
        .send({ ...validPriceConfig, plastic_without_min: 800000, plastic_without_max: 800000 });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
    });

    it("draft رو ذخیره کنه (فقط چند فیلد)", async () => {
      const res = await request(app).put("/price-config").send({
        plastic_per_liter: 700000,
      });

      expect(res.status).toBe(200);
      expect(Number(res.body.data.plastic_per_liter)).toBe(700000);
      expect(res.body.data.oil_per_liter).toBeNull();
    });
  });
});
