import type { ApiResponse } from "@/types/Api";
import { apiClient } from "../client";

export interface Estimate {
  id: string;
  project_id: string;
  with_materials: boolean;
  slider_value: number;
  paint_prices: Record<string, number>;
  customer_name: string | null;
  notes: string | null;
  created_at: string;
}

export interface CreateEstimatePayload {
  with_materials: boolean;
  slider_value: number;
  paint_prices: Record<string, number>;
  customer_name?: string;
  notes?: string;
}

export const estimateApi = {
  getByProject: async (projectId: string) => {
    const { data } = await apiClient.get<ApiResponse<Estimate>>(`/projects/${projectId}/estimates`);

    return data.data;
  },

  create: async (projectId: string, payload: CreateEstimatePayload) => {
    const { data } = await apiClient.post<ApiResponse<Estimate>>(`/projects/${projectId}/estimates`, payload);

    return data.data;
  },
};
