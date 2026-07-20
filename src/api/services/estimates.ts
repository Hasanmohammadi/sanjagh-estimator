import type { ApiResponse } from "@/types/Api";
import { apiClient } from "../client";
import type { EstimateFormValues } from "@/pages/estimation-results/schema";

export const estimateApi = {
  getByProject: async (projectId: string) => {
    const { data } = await apiClient.get<ApiResponse<EstimateFormValues>>(`/projects/${projectId}/estimates`);

    return data.data;
  },

  create: async (projectId: string, payload: EstimateFormValues) => {
    const { data } = await apiClient.post<ApiResponse<EstimateFormValues>>(`/projects/${projectId}/estimates`, payload);

    return data.data;
  },
};
