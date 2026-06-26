import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { roomApi, type CreateRoomPayload } from "@/api/services/rooms";

export function useCreateRoom(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRoomPayload) => roomApi.create(projectId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.rooms(projectId),
      });
    },
  });
}
