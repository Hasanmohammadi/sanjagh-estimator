import { useMutation } from "@tanstack/react-query";
import { draftRoomApi, type UpdateDraftRoomPayload } from "@/api/services/draft-rooms";

type UpdateDraftRoomVariables = {
  roomId: string;
  payload: UpdateDraftRoomPayload;
};

type UseUpdateDraftRoomOptions = {
  onSuccess?: () => void;
};

export function useUpdateDraftRoom(options?: UseUpdateDraftRoomOptions) {
  return useMutation({
    mutationFn: ({ roomId, payload }: UpdateDraftRoomVariables) => draftRoomApi.update(roomId, payload),

    onSuccess: () => {
      options?.onSuccess?.();
    },
  });
}
