import { useQuery } from "@tanstack/react-query";

import { priceConfigApi } from "@/api/services/price-config";
import { queryKeys } from "@/lib/queryKeys";

export function usePriceConfig() {
  return useQuery({
    queryKey: queryKeys.priceConfig,
    queryFn: priceConfigApi.get,
  });
}
