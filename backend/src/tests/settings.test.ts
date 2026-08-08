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
      await request(app).put("/settings").send({ theme: "light" });

      const res = await request(app).get("/settings");

      expect(res.status).toBe(200);
      expect(res.body.data.theme).toBe("light");
    });
  });

  describe("PUT /settings", () => {
    it("theme رو ذخیره کنه", async () => {
      const res = await request(app).put("/settings").send({ theme: "professional" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.theme).toBe("professional");
    });

    it("دوبار ذخیره کنه (upsert)", async () => {
      await request(app).put("/settings").send({ theme: "simple" });

      const updated = await request(app).put("/settings").send({ theme: "classic" });

      expect(updated.status).toBe(200);
      expect(updated.body.data.theme).toBe("classic");
    });

    it("همه تم‌های معتبر رو قبول کنه", async () => {
      const themes = ["professional", "light", "classic", "accurate"];

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
