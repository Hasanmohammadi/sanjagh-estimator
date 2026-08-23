import { useMutation } from "@tanstack/react-query";
import { draftRoomApi, type CreateDraftRoomPayload } from "@/api/services/draft-rooms";

type UseCreateDraftRoomOptions = {
  onSuccess?: () => void;
};

export function useCreateDraftRoom(options?: UseCreateDraftRoomOptions) {
  return useMutation({
    mutationFn: (payload: CreateDraftRoomPayload) => draftRoomApi.create(payload),

    onSuccess: () => {
      options?.onSuccess?.();
    },
  });
}
