import { useMutation, useQueryClient } from "@tanstack/react-query";

import { priceConfigApi, type UpdatePriceConfigPayload } from "@/api/services/priceConfig";

import { queryKeys } from "@/lib/queryKeys";

type UseUpdatePriceConfig = {
  onSuccess?: () => void;
};

export function useUpdatePriceConfig(options?: UseUpdatePriceConfig) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePriceConfigPayload) => priceConfigApi.update(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.priceConfig,
      });

      options?.onSuccess?.();
    },
  });
}
