import type { ApiResponse } from "@/types/Api";
import { apiClient } from "../client";

export interface PriceConfig {
  id: string;
  user_id: string;
  currency: string;

  plastic_per_liter: number;
  oil_per_liter: number;
  acrylic_per_liter: number;

  plastic_without_min: number;
  plastic_without_max: number;

  oil_without_min: number;
  oil_without_max: number;

  acrylic_without_min: number;
  acrylic_without_max: number;

  created_at: string;
  updated_at: string;
}

export interface UpdatePriceConfigPayload {
  currency: string;

  plastic_per_liter: number;
  oil_per_liter: number;
  acrylic_per_liter: number;

  plastic_without_min: number;
  plastic_without_max: number;

  oil_without_min: number;
  oil_without_max: number;

  acrylic_without_min: number;
  acrylic_without_max: number;
}

export const priceConfigApi = {
  get: async () => {
    const { data } = await apiClient.get<ApiResponse<PriceConfig>>("/price-config");
    return data.data;
  },

  update: async (payload: UpdatePriceConfigPayload) => {
    const { data } = await apiClient.put<ApiResponse<PriceConfig>>("/price-config", payload);
    return data.data;
  },
};
