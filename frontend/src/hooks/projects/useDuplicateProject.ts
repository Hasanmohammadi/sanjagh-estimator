import { projectApi, type Project } from "@/api/services/projects";
import { useMutation } from "@tanstack/react-query";

type UseDuplicateProjectOptions = {
  onSuccess?: (data: Project | null) => void;
};

export function useDuplicateProject(options?: UseDuplicateProjectOptions) {
  return useMutation({
    mutationFn: projectApi.duplicate,
    onSuccess: data => {
      options?.onSuccess?.(data);
    },
  });
}
