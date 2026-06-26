import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { projectApi } from "@/api/services/projects";

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: projectApi.getAll,
  });
}
