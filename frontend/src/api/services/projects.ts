import type { ApiResponse } from "@/types/Api";
import { apiClient } from "../client";
import type { Room } from "./rooms";

export interface Project {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  meterage: string;
  rooms?: Room[];
}

export interface CreateProjectPayload {
  title: string;
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
  create: async (payload: CreateProjectPayload) => {
    const { data } = await apiClient.post<ApiResponse<Project>>("/projects", payload);
    return data.data;
  },
  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(`/projects/${id}`);
    return data.data;
  },
};
