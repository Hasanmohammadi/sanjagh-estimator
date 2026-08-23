import { useQuery } from "@tanstack/react-query";
import { draftApi } from "@/api/services/draft";
import { queryKeys } from "@/lib/queryKeys";

export function useDraftCalculate() {
  return useQuery({
    queryKey: queryKeys.draftRooms,
    queryFn: draftApi.calculate,
  });
}
