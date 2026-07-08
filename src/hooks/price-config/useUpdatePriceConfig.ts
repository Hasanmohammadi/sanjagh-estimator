import { useMutation, useQueryClient } from "@tanstack/react-query";

import { priceConfigApi, type UpdatePriceConfigPayload } from "@/api/services/price-config";
import { queryKeys } from "@/lib/queryKeys";

export function useUpdatePriceConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePriceConfigPayload) => priceConfigApi.update(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.priceConfig,
      });
    },
  });
}
