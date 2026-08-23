import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { draftApi, type UpdateDraftInput } from "@/api/services/draft";

export function useUpdateDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDraftInput) => draftApi.update(payload),

    onSuccess: data => {
      queryClient.setQueryData(queryKeys.draft, data);
    },
  });
}
