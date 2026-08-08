import { useMutation } from "@tanstack/react-query";
import { roomApi, type CreateRoomPayload, type Room } from "@/api/services/rooms";

type UseCreateRoomOptions = {
  onSuccess?: (data: Room | null) => void;
  projectId: string;
};

export function useCreateRoom(options: UseCreateRoomOptions) {
  return useMutation({
    mutationFn: (payload: CreateRoomPayload) => roomApi.create(options.projectId, payload),
    onSuccess: data => {
      options?.onSuccess?.(data);
    },
  });
}
