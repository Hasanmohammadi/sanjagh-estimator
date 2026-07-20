import { useQuery } from "@tanstack/react-query";

import { priceConfigApi } from "@/api/services/priceConfig";
import { queryKeys } from "@/lib/queryKeys";

export function usePriceConfig() {
  return useQuery({
    queryKey: queryKeys.priceConfig,
    queryFn: priceConfigApi.get,
  });
}
