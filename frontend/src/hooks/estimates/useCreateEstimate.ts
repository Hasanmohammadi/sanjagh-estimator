import { useMutation } from "@tanstack/react-query";
import { estimateApi } from "@/api/services/estimates";
import type { EstimateFormValues } from "@/pages/estimation-results/schema";

type UseUpdatePriceConfig = {
  onSuccess?: () => void;
};

export function useCreateEstimate(projectId: string, options?: UseUpdatePriceConfig) {
  return useMutation({
    mutationFn: (payload: EstimateFormValues) => estimateApi.create(projectId, payload),

    onSuccess: () => {
      options?.onSuccess?.();
    },
  });
}
