import { useMutation } from "@tanstack/react-query";
import { draftApi } from "@/api/services/draft";

type useCopyProjectToDraftOptions = {
  onSuccess?: () => void;
};

export function useCopyProjectToDraft(options?: useCopyProjectToDraftOptions) {
  return useMutation({
    mutationFn: (projectId: string) => draftApi.copyProjectToDraft(projectId),

    onSuccess: () => {
      options?.onSuccess?.();
    },
  });
}
