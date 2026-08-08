import { projectApi, type Project } from "@/api/services/projects";
import { useMutation } from "@tanstack/react-query";

type UseCreateProjectOptions = {
  onSuccess?: (data: Project | null) => void;
};

export function useCreateProject(options?: UseCreateProjectOptions) {
  return useMutation({
    mutationFn: projectApi.create,
    onSuccess: data => {
      options?.onSuccess?.(data);
    },
  });
}
