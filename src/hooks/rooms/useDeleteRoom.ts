import { useMutation } from "@tanstack/react-query";
import { roomApi } from "@/api/services/rooms";

type UseDeleteRoomOptions = {
  onSuccess?: () => void;
  projectId: string;
};

export function useDeleteRoom(options: UseDeleteRoomOptions) {
  return useMutation({
    mutationFn: (roomId: string) => roomApi.delete(options?.projectId, roomId),
    onSuccess: () => {
      options?.onSuccess?.();
    },
  });
}
