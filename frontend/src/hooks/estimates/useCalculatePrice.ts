import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { calculatePriceApi } from "@/api/services/calculatePrice";

export function useCalculatePrice(projectId: string) {
  return useQuery({
    queryKey: [...queryKeys.calculate(projectId)],
    queryFn: () => calculatePriceApi.calculate(projectId),
    enabled: !!projectId,
  });
}
