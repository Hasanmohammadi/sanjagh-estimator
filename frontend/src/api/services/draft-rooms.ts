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
export enum RoomTypeDic {
  bedroom = "اتاق خواب",
  living_room = "پذیرایی",
  bathroom = "سرویس",
  kitchen = "آشپزخانه",
  hallway = "راهرو",
  other = "سایر",
}
export enum PaintType {
  Acrylic = "acrylic",
  Oil = "oil",
  Plastic = "plastic",
}
export enum PaintTypeDic {
  acrylic = "آکریلیک",
  oil = "روغن",
  plastic = "پلاستیک",
}
export interface Room {
  id: string;
  project_id: string;
  type: RoomType;
  width: string;
  length: string;
  height: string;
  wall_paint_type: PaintType;
  wall_coats: number;
  ceiling_enabled: boolean;
  ceiling_paint_type: PaintType;
  ceiling_coats: number;
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

export interface DraftRoom {
  id: string;
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

export interface CreateDraftRoomPayload {
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

export type UpdateDraftRoomPayload = Partial<CreateDraftRoomPayload>;

export const draftRoomApi = {
  create: async (payload: CreateDraftRoomPayload) => {
    const { data } = await apiClient.post<ApiResponse<DraftRoom>>("/draft/rooms", payload);

    return data.data;
  },

  update: async (roomId: string, payload: UpdateDraftRoomPayload) => {
    const { data } = await apiClient.patch<ApiResponse<DraftRoom>>(`/draft/rooms/${roomId}`, payload);

    return data.data;
  },

  delete: async (roomId: string) => {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(`/draft/rooms/${roomId}`);

    return data.data;
  },
};
