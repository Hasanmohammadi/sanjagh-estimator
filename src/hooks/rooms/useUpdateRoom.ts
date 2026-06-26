import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { roomApi, type UpdateRoomPayload } from "@/api/services/rooms";

export function useUpdateRoom(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, payload }: { roomId: string; payload: UpdateRoomPayload }) =>
      roomApi.update(projectId, roomId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.rooms(projectId),
      });
    },
  });
}
