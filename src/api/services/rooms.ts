import type { ApiResponse } from "@/types/Api";
import { apiClient } from "../client";

export enum RoomType {
  Bedroom = "bedroom",
  LivingRoom = "living_room",
  Bathroom = "bathroom",
  Kitchen = "kitchen",
  Hallway = "hallway",
  Other = "other",
}

export enum PaintType {
  Acrylic = "acrylic",
  OilBased = "oil_based",
  PlasticEmulsion = "plastic_emulsion",
}

export interface Room {
  id: string;
  project_id: string;
  type: RoomType;
  width: number;
  length: number;
  height: number;
  wall_paint_type: PaintType;
  wall_coats: number;
  ceiling_enabled: boolean;
  ceiling_paint_type: PaintType | null;
  ceiling_coats: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateRoomPayload {
  type: RoomType;
  width: number;
  length: number;
  height: number;
  wall_paint_type: PaintType;
  wall_coats: number;
  ceiling_enabled: boolean;
  ceiling_paint_type?: PaintType;
  ceiling_coats?: number;
}

export type UpdateRoomPayload = CreateRoomPayload;

export const roomApi = {
  create: async (projectId: string, payload: CreateRoomPayload) => {
    const { data } = await apiClient.post<ApiResponse<Room>>(`/projects/${projectId}/rooms`, payload);

    return data.data;
  },

  update: async (projectId: string, roomId: string, payload: UpdateRoomPayload) => {
    const { data } = await apiClient.put<ApiResponse<Room>>(`/projects/${projectId}/rooms/${roomId}`, payload);

    return data.data;
  },

  delete: async (projectId: string, roomId: string) => {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(`/projects/${projectId}/rooms/${roomId}`);

    return data.data;
  },
};
