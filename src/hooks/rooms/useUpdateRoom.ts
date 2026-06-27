import { useMutation } from "@tanstack/react-query";
import { roomApi, type UpdateRoomPayload } from "@/api/services/rooms";

type UseEditRoomOptions = {
  onSuccess?: () => void;
  projectId: string;
};

export function useUpdateRoom(options: UseEditRoomOptions) {
  return useMutation({
    mutationFn: ({ roomId, payload }: { roomId: string; payload: UpdateRoomPayload }) =>
      roomApi.update(options?.projectId, roomId, payload),

    onSuccess: () => {
      options?.onSuccess?.();
    },
  });
}
