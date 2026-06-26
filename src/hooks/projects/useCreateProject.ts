import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { projectApi } from "@/api/services/projects";

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectApi.create,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects,
      });
    },
  });
}
