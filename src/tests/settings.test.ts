import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

describe("Settings API", () => {
  describe("GET /settings", () => {
    it("اگه settings نداشت default برگردونه", async () => {
      const res = await request(app).get("/settings");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.theme).toBe("light");
    });

    it("بعد از ذخیره، settings رو برگردونه", async () => {
      await request(app).put("/settings").send({ theme: "modern" });

      const res = await request(app).get("/settings");

      expect(res.status).toBe(200);
      expect(res.body.data.theme).toBe("modern");
    });
  });

  describe("PUT /settings", () => {
    it("theme رو ذخیره کنه", async () => {
      const res = await request(app).put("/settings").send({ theme: "luxury" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.theme).toBe("luxury");
    });

    it("دوبار ذخیره کنه (upsert)", async () => {
      await request(app).put("/settings").send({ theme: "simple" });

      const updated = await request(app).put("/settings").send({ theme: "classic" });

      expect(updated.status).toBe(200);
      expect(updated.body.data.theme).toBe("classic");
    });

    it("همه تم‌های معتبر رو قبول کنه", async () => {
      const themes = ["simple", "normal", "modern", "luxury", "warm", "classic"];

      for (const theme of themes) {
        const res = await request(app).put("/settings").send({ theme });
        expect(res.status).toBe(200);
        expect(res.body.data.theme).toBe(theme);
      }
    });

    it("تم نامعتبر رو رد کنه", async () => {
      const res = await request(app).put("/settings").send({ theme: "invalid_theme" });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
    });

    it("اگه theme نباشه خطا بده", async () => {
      const res = await request(app).put("/settings").send({});

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
    });
  });
});
