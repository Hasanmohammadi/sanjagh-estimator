import { settingsService } from "@/api/services/settings";
import { useMutation } from "@tanstack/react-query";

type UseUpdateSettingsOptions = {
  onSuccess?: () => void;
};

export function useUpdateSettings(options: UseUpdateSettingsOptions) {
  return useMutation({
    mutationFn: settingsService.updateSettings,
    onSuccess() {
      options.onSuccess?.();
    },
  });
}
