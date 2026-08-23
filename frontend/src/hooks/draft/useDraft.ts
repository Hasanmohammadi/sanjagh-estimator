import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { draftApi } from "@/api/services/draft";

export function useDraft() {
  return useQuery({
    queryKey: queryKeys.draft,
    queryFn: () => draftApi.get(),
  });
}
