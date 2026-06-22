import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

const createProject = async () => {
  const res = await request(app).post("/projects").send({ title: "پروژه تست" });
  return res.body.data;
};

const validRoom = {
  type: "bedroom",
  width: 4,
  length: 5,
  height: 2.8,
  wall_paint_type: "plastic",
  wall_coats: 2,
  ceiling_enabled: false,
};

describe("Rooms API", () => {
  describe("POST /projects/:project_id/rooms", () => {
    it("should create a room successfully", async () => {
      const project = await createProject();

      const res = await request(app)
        .post(`/projects/${project.id}/rooms`)
        .send(validRoom);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.type).toBe("bedroom");
      expect(res.body.data.project_id).toBe(project.id);
    });

    it("should fail if project does not exist", async () => {
      const res = await request(app)
        .post("/projects/9999/rooms")
        .send(validRoom);

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
    });

    it("should fail if required fields are missing", async () => {
      const project = await createProject();

      const res = await request(app)
        .post(`/projects/${project.id}/rooms`)
        .send({ type: "bedroom" });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
    });

    it("should fail if ceiling_enabled but ceiling_paint_type missing", async () => {
      const project = await createProject();

      const res = await request(app)
        .post(`/projects/${project.id}/rooms`)
        .send({ ...validRoom, ceiling_enabled: true });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
    });

    it("should create room with ceiling successfully", async () => {
      const project = await createProject();

      const res = await request(app)
        .post(`/projects/${project.id}/rooms`)
        .send({
          ...validRoom,
          ceiling_enabled: true,
          ceiling_paint_type: "plastic",
          ceiling_coats: 2,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.ceiling_enabled).toBe(true);
    });
  });

  describe("PUT /projects/:project_id/rooms/:room_id", () => {
    it("should update room successfully", async () => {
      const project = await createProject();

      const created = await request(app)
        .post(`/projects/${project.id}/rooms`)
        .send(validRoom);

      const roomId = created.body.data.id;

      const res = await request(app)
        .put(`/projects/${project.id}/rooms/${roomId}`)
        .send({ ...validRoom, width: 6 });

      expect(res.status).toBe(200);
      expect(Number(res.body.data.width)).toBe(6);
    });

    it("should return 404 for non-existent room", async () => {
      const project = await createProject();

      const res = await request(app)
        .put(`/projects/${project.id}/rooms/9999`)
        .send(validRoom);

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
    });
  });

  describe("DELETE /projects/:project_id/rooms/:room_id", () => {
    it("should delete room successfully", async () => {
      const project = await createProject();

      const created = await request(app)
        .post(`/projects/${project.id}/rooms`)
        .send(validRoom);

      const roomId = created.body.data.id;

      const res = await request(app).delete(
        `/projects/${project.id}/rooms/${roomId}`,
      );

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    });

    it("should return 404 for non-existent room", async () => {
      const project = await createProject();

      const res = await request(app).delete(
        `/projects/${project.id}/rooms/9999`,
      );

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
    });
  });
});
