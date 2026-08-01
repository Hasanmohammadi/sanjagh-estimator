import { settingsService } from "@/api/services/settings";
import { useQuery } from "@tanstack/react-query";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: settingsService.getSettings,
  });
}
