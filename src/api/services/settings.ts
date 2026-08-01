import { apiClient } from "../client";

export type Theme = "professional" | "light" | "classic" | "accurate";

export interface Settings {
  theme: Theme;
}

export const settingsService = {
  async getSettings() {
    const { data } = await apiClient.get<{ data: Settings }>("/settings");
    return data.data;
  },

  async updateSettings(payload: Settings) {
    const { data } = await apiClient.put<{ data: Settings }>("/settings", payload);

    return data.data;
  },
};
