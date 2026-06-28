import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";
import { NON_EXISTENT_UUID } from "./setup";

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
