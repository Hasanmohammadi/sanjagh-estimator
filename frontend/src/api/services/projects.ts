import type { ApiResponse } from "@/types/Api";
import { apiClient } from "../client";
import type { Room } from "./draft-rooms";

export interface Project {
  id: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  meterage: string;
  rooms?: Room[];
}

export const projectApi = {
  getAll: async () => {
    const { data } = await apiClient.get<ApiResponse<Project[]>>("/projects");
    return data.data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
    return data.data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(`/projects/${id}`);
    return data.data;
  },
};
