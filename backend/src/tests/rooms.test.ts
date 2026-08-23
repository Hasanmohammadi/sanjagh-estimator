import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";
import { NON_EXISTENT_UUID } from "./setup";

const validRoom = {
  type: "bedroom",
  width: 4,
  length: 5,
  height: 2.8,
  wall_paint_type: "plastic",
  wall_coats: 2,
  ceiling_enabled: false,
};

describe("Draft Rooms API", () => {
  describe("POST /draft/rooms", () => {
    it("should create a room successfully", async () => {
      const res = await request(app).post("/draft/rooms").send(validRoom);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");

      expect(res.body.data).toBeDefined();
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.type).toBe("bedroom");
      expect(Number(res.body.data.width)).toBe(4);
      expect(Number(res.body.data.length)).toBe(5);
    });

    it("should automatically create draft when first room is added", async () => {
      const roomRes = await request(app).post("/draft/rooms").send(validRoom);

      expect(roomRes.status).toBe(201);

      const draftRes = await request(app).get("/draft");

      expect(draftRes.status).toBe(200);
      expect(draftRes.body.status).toBe("success");
      expect(draftRes.body.data).toBeDefined();

      expect(draftRes.body.data.rooms).toHaveLength(1);
      expect(draftRes.body.data.rooms[0].id).toBe(roomRes.body.data.id);
    });

    it("should fail if required fields are missing", async () => {
      const res = await request(app).post("/draft/rooms").send({
        type: "bedroom",
      });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
    });

    it("should fail if ceiling is enabled without paint type", async () => {
      const res = await request(app)
        .post("/draft/rooms")
        .send({
          ...validRoom,
          ceiling_enabled: true,
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
    });

    it("should create room with ceiling successfully", async () => {
      const res = await request(app)
        .post("/draft/rooms")
        .send({
          ...validRoom,
          ceiling_enabled: true,
          ceiling_paint_type: "plastic",
          ceiling_coats: 2,
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.ceiling_enabled).toBe(true);
      expect(res.body.data.ceiling_paint_type).toBe("plastic");
      expect(res.body.data.ceiling_coats).toBe(2);
    });
  });

  describe("GET /draft/rooms", () => {
    it("should return all draft rooms", async () => {
      await request(app).post("/draft/rooms").send(validRoom);

      await request(app)
        .post("/draft/rooms")
        .send({
          ...validRoom,
          type: "living_room",
        });

      const res = await request(app).get("/draft/rooms");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");

      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0].type).toBe("bedroom");
      expect(res.body.data[1].type).toBe("living_room");
    });

    it("should return empty array when draft does not exist", async () => {
      const res = await request(app).get("/draft/rooms");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data).toEqual([]);
    });
  });

  describe("PATCH /draft/rooms/:roomId", () => {
    it("should update room successfully", async () => {
      const created = await request(app).post("/draft/rooms").send(validRoom);

      const roomId = created.body.data.id;

      const res = await request(app).patch(`/draft/rooms/${roomId}`).send({
        width: 6,
      });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(Number(res.body.data.width)).toBe(6);
      expect(res.body.data.id).toBe(roomId);
    });

    it("should return 404 for non-existent room", async () => {
      const res = await request(app).patch(`/draft/rooms/${NON_EXISTENT_UUID}`).send({
        width: 6,
      });

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
    });

    it("should update only provided fields", async () => {
      const created = await request(app).post("/draft/rooms").send(validRoom);

      const roomId = created.body.data.id;

      const res = await request(app).patch(`/draft/rooms/${roomId}`).send({
        width: 7,
      });

      expect(res.status).toBe(200);
      expect(Number(res.body.data.width)).toBe(7);
      expect(Number(res.body.data.length)).toBe(5);
      expect(res.body.data.type).toBe("bedroom");
    });
  });

  describe("DELETE /draft/rooms/:roomId", () => {
    it("should delete room successfully", async () => {
      const created = await request(app).post("/draft/rooms").send(validRoom);

      const roomId = created.body.data.id;

      const res = await request(app).delete(`/draft/rooms/${roomId}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    });

    it("should remove room from draft", async () => {
      const created = await request(app).post("/draft/rooms").send(validRoom);

      const roomId = created.body.data.id;

      await request(app).delete(`/draft/rooms/${roomId}`);

      const roomsRes = await request(app).get("/draft/rooms");

      expect(roomsRes.status).toBe(200);
      expect(roomsRes.body.data).toHaveLength(0);
    });

    it("should return 404 for non-existent room", async () => {
      const res = await request(app).delete(`/draft/rooms/${NON_EXISTENT_UUID}`);

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
    });
  });
});
