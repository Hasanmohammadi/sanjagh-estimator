import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { projectApi } from "@/api/services/projects";

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectApi.delete,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects,
      });
    },
  });
}
