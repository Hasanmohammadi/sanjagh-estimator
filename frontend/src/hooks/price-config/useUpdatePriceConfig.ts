import { useMutation } from "@tanstack/react-query";

import { priceConfigApi, type UpdatePriceConfigPayload } from "@/api/services/priceConfig";

type UseUpdatePriceConfig = {
  onSuccess?: () => void;
};

export function useUpdatePriceConfig(options?: UseUpdatePriceConfig) {
  return useMutation({
    mutationFn: (payload: UpdatePriceConfigPayload) => priceConfigApi.update(payload),
    onSuccess: () => {
      options?.onSuccess?.();
    },
  });
}
