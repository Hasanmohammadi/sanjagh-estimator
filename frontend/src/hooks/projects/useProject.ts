import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { projectApi } from "@/api/services/projects";

export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.project(id),
    queryFn: () => projectApi.getById(id),
    enabled: !!id,
  });
}
