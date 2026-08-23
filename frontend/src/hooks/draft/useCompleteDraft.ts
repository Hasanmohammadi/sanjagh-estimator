import { useMutation } from "@tanstack/react-query";
import { draftApi, type CompletedProject, type CompleteDraftPayload } from "@/api/services/draft";

type UseCompleteDraftOptions = {
  onSuccess?: (data: CompletedProject | null) => void;
};

export function useCompleteDraft(options?: UseCompleteDraftOptions) {
  return useMutation({
    mutationFn: (payload: CompleteDraftPayload) => draftApi.complete(payload),

    onSuccess: data => {
      options?.onSuccess?.(data);
    },
  });
}
