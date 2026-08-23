import { useMutation } from "@tanstack/react-query";
import { draftRoomApi } from "@/api/services/draft-rooms";

type UseDeleteDraftRoomOptions = {
  onSuccess?: () => void;
};

export function useDeleteDraftRoom(options?: UseDeleteDraftRoomOptions) {
  return useMutation({
    mutationFn: (roomId: string) => draftRoomApi.delete(roomId),

    onSuccess: () => {
      options?.onSuccess?.();
    },
  });
}
