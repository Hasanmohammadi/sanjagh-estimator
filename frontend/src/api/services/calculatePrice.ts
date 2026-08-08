import type { ApiResponse } from "@/types/Api";
import { apiClient } from "../client";

export interface CalculateEstimateParams {
  with_materials: boolean;
  slider_value: number;
}

export interface CalculateEstimateResponse {
  project_id: string;
  with_materials: boolean;
  slider_value: number;
  has_price_config: boolean;
  calculation: {
    final_cost: number;
    days: number;
    paint_area: number;

    materials: {
      paints: Paints;
      accessories_cost: number;
      total_materials_cost: number;
    };
  };
}

export interface Paints {
  plastic: PaintDetail;
  oil: PaintDetail;
  acrylic: PaintDetail;
}

export interface PaintDetail {
  liters: number;
  total_cost: number;
  price_per_liter: number;
}

export interface CreateEstimatePayload {
  with_materials: boolean;
  slider_value: number;
  customerName?: string;
  notes?: string;

  paint_price_per_liter?: {
    plastic?: number;
    oil?: number;
    acrylic?: number;
  };

  paint_prices?: {
    plastic_without?: number;
    oil_without?: number;
    acrylic_without?: number;
  };
}

export const calculatePriceApi = {
  calculate: async (projectId: string) => {
    const { data } = await apiClient.get<ApiResponse<CalculateEstimateResponse>>(
      `/projects/${projectId}/estimates/calculate`,
    );

    return data.data;
  },
};
