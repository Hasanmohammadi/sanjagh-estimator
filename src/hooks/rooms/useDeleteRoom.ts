import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { roomApi } from "@/api/services/rooms";

export function useDeleteRoom(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => roomApi.delete(projectId, roomId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.rooms(projectId),
      });
    },
  });
}
