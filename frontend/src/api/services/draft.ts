import type { ApiResponse } from "@/types/Api";
import { apiClient } from "../client";

import type { Room } from "./draft-rooms";

export interface UpdateDraftInput {
  customer_name?: string;
  rooms?: Room[];
}

export interface DraftCalculation {
  has_price_config: boolean;
  customer_name: string | null;
  rooms: unknown[];
  calculation: {
    final_cost: number;
    min_total_price: number;
    max_total_price: number;
    days: number;
    paint_area: number;
    total_paint_cost: number;
    materials: {
      paints: {
        plastic: {
          liters: number;
          total_cost: number;
          price_per_liter: number;
        };
        oil: {
          liters: number;
          total_cost: number;
          price_per_liter: number;
        };
        acrylic: {
          liters: number;
          total_cost: number;
          price_per_liter: number;
        };
      };
      accessories_cost: number;
      total_materials_cost: number;
    };
  };
}

export interface CompleteDraftPayload {
  notes?: string;
  customerName?: string;
  totalCost: number;
  totalMaterialCost: number;
  accessoriesCost: number;
  paints: {
    plastic: {
      liters: number;
      total_cost: number;
      price_per_liter: number;
    };
    oil: {
      liters: number;
      total_cost: number;
      price_per_liter: number;
    };
    acrylic: {
      liters: number;
      total_cost: number;
      price_per_liter: number;
    };
  };
  meterage: number;
  days: number;
  visibility: {
    days: boolean;
    final_cost: boolean;
    materials: boolean;
    paint_area: boolean;
  };
}

export interface CompletedProject {
  id: string;
  user_id: string;
  customer_name: string;
  created_at: string;
  updated_at: string;
}

interface DraftResponse {
  customer_name?: string;
  rooms?: Room[];
}

export const draftApi = {
  get: async () => {
    const { data } = await apiClient.get<ApiResponse<DraftResponse>>("/draft");
    return data.data;
  },

  update: async (payload: UpdateDraftInput) => {
    const { data } = await apiClient.put<ApiResponse<DraftResponse>>("/draft", payload);

    return data.data;
  },
  calculate: async () => {
    const { data } = await apiClient.get<ApiResponse<DraftCalculation>>("/draft/calculate");

    return data.data;
  },
  complete: async (payload: CompleteDraftPayload) => {
    const { data } = await apiClient.post<ApiResponse<CompletedProject>>("/draft/complete", payload);

    return data.data;
  },
  copyProjectToDraft: async (projectId: string) => {
    const { data } = await apiClient.post<ApiResponse<DraftResponse>>(`/draft/copy-project-to-draft/${projectId}`);

    return data.data;
  },
};
