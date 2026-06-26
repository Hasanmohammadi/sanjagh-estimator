import { useMutation, useQueryClient } from "@tanstack/react-query";
import { estimateApi } from "@/api/services/estimates";
import { queryKeys } from "@/lib/queryKeys";
import type { CreateEstimatePayload } from "@/api/services/estimates";

export function useCreateEstimate(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEstimatePayload) => estimateApi.create(projectId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.estimate(projectId),
      });
    },
  });
}
