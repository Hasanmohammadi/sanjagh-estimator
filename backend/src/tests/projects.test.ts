import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";
import { NON_EXISTENT_UUID } from "./setup";
import pool from "../db";

import type { CreateRoomInput } from "../validators/draft.validator";

const validRoom: CreateRoomInput = {
  type: "bedroom",
  width: 4,
  length: 5,
  height: 2.8,
  wall_paint_type: "plastic",
  wall_coats: 2,
  ceiling_enabled: false,
};

const createProject = async (customer_name = "ایمان نجاتی") => {
  const result = await pool.query(
    `
      INSERT INTO projects (
        user_id,
        customer_name
      )
      VALUES ($1, $2)
      RETURNING *
    `,
    ["00000000-0000-0000-0000-000000000001", customer_name],
  );

  return result.rows[0];
};

const addRoom = async (projectId: string, room = validRoom) => {
  const result = await pool.query(
    `
      INSERT INTO rooms (
        project_id,
        type,
        width,
        length,
        height,
        wall_paint_type,
        wall_coats,
        ceiling_enabled,
        ceiling_paint_type,
        ceiling_coats
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `,
    [
      projectId,
      room.type,
      room.width,
      room.length,
      room.height,
      room.wall_paint_type,
      room.wall_coats,
      room.ceiling_enabled,
      room.ceiling_paint_type ?? null,
      room.ceiling_coats ?? null,
    ],
  );

  return result.rows[0];
};

describe("Projects API", () => {
  describe("GET /projects", () => {
    it("should return empty array when user has no projects", async () => {
      const res = await request(app).get("/projects");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data).toEqual([]);
    });

    it("should return user's projects", async () => {
      await createProject("پروژه اول");
      await createProject("پروژه دوم");

      const res = await request(app).get("/projects");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data).toHaveLength(2);
    });

    it("should not return projects belonging to another user", async () => {
      await createProject("پروژه من");

      await pool.query(
        `
          INSERT INTO projects (
            user_id,
            customer_name
          )
          VALUES ($1, $2)
        `,
        ["00000000-0000-0000-0000-000000000002", "پروژه کاربر دیگر"],
      );

      const res = await request(app).get("/projects");

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].customer_name).toBe("پروژه من");
    });

    it("should return projects ordered by newest first", async () => {
      const first = await createProject("پروژه اول");

      await new Promise(resolve => setTimeout(resolve, 10));

      const second = await createProject("پروژه دوم");

      const res = await request(app).get("/projects");

      expect(res.status).toBe(200);
      expect(res.body.data[0].id).toBe(second.id);
      expect(res.body.data[1].id).toBe(first.id);
    });

    it("should calculate meterage for projects with rooms", async () => {
      const project = await createProject();

      await addRoom(project.id);

      const res = await request(app).get("/projects");

      expect(res.status).toBe(200);

      const returnedProject = res.body.data.find((item: { id: string }) => item.id === project.id);

      // wall = 2 * (4 + 5) * 2.8 = 50.4
      expect(returnedProject.meterage).toBe(50.4);
    });

    it("should include ceiling area when ceiling is enabled", async () => {
      const project = await createProject();

      await addRoom(project.id, {
        ...validRoom,
        ceiling_enabled: true,
        ceiling_paint_type: "plastic",
        ceiling_coats: 2,
      });

      const res = await request(app).get("/projects");

      const returnedProject = res.body.data.find((item: { id: string }) => item.id === project.id);

      // wall = 50.4
      // ceiling = 4 * 5 = 20
      // total = 70.4
      expect(returnedProject.meterage).toBe(70.4);
    });

    it("should return meterage 0 for project without rooms", async () => {
      const project = await createProject();

      const res = await request(app).get("/projects");

      const returnedProject = res.body.data.find((item: { id: string }) => item.id === project.id);

      expect(returnedProject.meterage).toBe(0);
    });

    it("should not return title", async () => {
      await createProject();

      const res = await request(app).get("/projects");

      expect(res.status).toBe(200);
      expect(res.body.data[0]).not.toHaveProperty("title");
    });
  });

  describe("GET /projects/:projectId", () => {
    it("should return project by id", async () => {
      const project = await createProject();

      const res = await request(app).get(`/projects/${project.id}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.id).toBe(project.id);
      expect(res.body.data.customer_name).toBe("ایمان نجاتی");
    });

    it("should return project with rooms", async () => {
      const project = await createProject();

      await addRoom(project.id);

      const res = await request(app).get(`/projects/${project.id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.rooms).toHaveLength(1);

      expect(res.body.data.rooms[0].type).toBe("bedroom");
      expect(Number(res.body.data.rooms[0].width)).toBe(4);
      expect(Number(res.body.data.rooms[0].length)).toBe(5);
      expect(Number(res.body.data.rooms[0].height)).toBe(2.8);
    });

    it("should return empty rooms array when project has no rooms", async () => {
      const project = await createProject();

      const res = await request(app).get(`/projects/${project.id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.rooms).toEqual([]);
    });

    it("should calculate meterage correctly", async () => {
      const project = await createProject();

      await addRoom(project.id);

      const res = await request(app).get(`/projects/${project.id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.meterage).toBe(50.4);
    });

    it("should calculate meterage for multiple rooms", async () => {
      const project = await createProject();

      await addRoom(project.id, {
        ...validRoom,
        width: 4,
        length: 5,
      });

      await addRoom(project.id, {
        ...validRoom,
        type: "living_room",
        width: 6,
        length: 7,
      });

      const res = await request(app).get(`/projects/${project.id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.rooms).toHaveLength(2);

      // Room 1: 50.4
      // Room 2: 2 * (6 + 7) * 2.8 = 72.8
      // Total: 123.2
      expect(res.body.data.meterage).toBe(123.2);
    });

    it("should return 404 for non-existent project", async () => {
      const res = await request(app).get(`/projects/${NON_EXISTENT_UUID}`);

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
    });

    it("should return 400 for invalid project id", async () => {
      const res = await request(app).get("/projects/invalid-id");

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
    });

    it("should not return another user's project", async () => {
      const project = await createProject();

      await pool.query(
        `
          UPDATE projects
          SET user_id = $1
          WHERE id = $2
        `,
        ["00000000-0000-0000-0000-000000000002", project.id],
      );

      const res = await request(app).get(`/projects/${project.id}`);

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
    });

    it("should not return title", async () => {
      const project = await createProject();

      const res = await request(app).get(`/projects/${project.id}`);

      expect(res.status).toBe(200);
      expect(res.body.data).not.toHaveProperty("title");
    });
  });

  describe("DELETE /projects/:projectId", () => {
    it("should delete project successfully", async () => {
      const project = await createProject();

      const res = await request(app).delete(`/projects/${project.id}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.message).toBe("Project deleted successfully");
    });

    it("should actually remove the project from database", async () => {
      const project = await createProject();

      await request(app).delete(`/projects/${project.id}`);

      const result = await pool.query("SELECT id FROM projects WHERE id = $1", [project.id]);

      expect(result.rows).toHaveLength(0);
    });

    it("should return 404 for non-existent project", async () => {
      const res = await request(app).delete(`/projects/${NON_EXISTENT_UUID}`);

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
    });

    it("should return 400 for invalid project id", async () => {
      const res = await request(app).delete("/projects/invalid-id");

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
    });

    it("should not delete another user's project", async () => {
      const project = await createProject();

      await pool.query(
        `
          UPDATE projects
          SET user_id = $1
          WHERE id = $2
        `,
        ["00000000-0000-0000-0000-000000000002", project.id],
      );

      const res = await request(app).delete(`/projects/${project.id}`);

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");

      const result = await pool.query("SELECT id FROM projects WHERE id = $1", [project.id]);

      expect(result.rows).toHaveLength(1);
    });

    it("should delete project's rooms through cascade", async () => {
      const project = await createProject();

      await addRoom(project.id);

      const beforeDelete = await pool.query("SELECT id FROM rooms WHERE project_id = $1", [project.id]);

      expect(beforeDelete.rows).toHaveLength(1);

      await request(app).delete(`/projects/${project.id}`);

      const afterDelete = await pool.query("SELECT id FROM rooms WHERE project_id = $1", [project.id]);

      expect(afterDelete.rows).toHaveLength(0);
    });
  });
});
