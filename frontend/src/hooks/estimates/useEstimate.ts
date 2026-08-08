import { useQuery } from "@tanstack/react-query";
import { estimateApi } from "@/api/services/estimates";
import { queryKeys } from "@/lib/queryKeys";

export function useEstimate(projectId: string) {
  return useQuery({
    queryKey: queryKeys.estimate(projectId),

    queryFn: () => estimateApi.getByProject(projectId),

    enabled: !!projectId,
  });
}
