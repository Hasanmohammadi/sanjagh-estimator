import { PaintTypeDic, RoomTypeDic, type Room } from "@/api/services/draft-rooms";
import { EditIcon, RemoveIcon } from "@/assets/icons";
import { ConfirmModal } from "@/components/common";
import { useDeleteDraftRoom } from "@/hooks/draft-rooms/useDeleteDraftRoom";
import { queryKeys } from "@/lib/queryKeys";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface Props {
  room: Room;
  onEdit: () => void;
}

export default function RoomCard({
  room: { height, length, type, wall_paint_type, width, ceiling_paint_type, id },
  onEdit,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string>();

  const queryClient = useQueryClient();

  const { mutate: deleteDraftRoom } = useDeleteDraftRoom({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.draft,
      });
    },
  });

  return (
    <div className="border-2 border-design-gray-200 p-3 pt-6 rounded-lg">
      <div className="flex justify-between">
        <DesignTitle sizeVariant="SecondTitle" text={RoomTypeDic[type]} titleVariant="Body" color="BlackMain" />
        <div className="flex justify-end gap-2 items-center">
          <div className="bg-design-gray-100 p-2.5 rounded-xl" onClick={onEdit}>
            <EditIcon />
          </div>
          <div
            className="bg-red-100 p-2.5 rounded-xl"
            onClick={() => {
              setIsOpen(true);
              setSelectedRoomId(id);
            }}
          >
            <RemoveIcon />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-3">
        <DesignTitle
          sizeVariant="Subtitle"
          text={`دیوار: ${PaintTypeDic[wall_paint_type]}`}
          titleVariant="Body"
          color="Gray500"
        />
        {!!ceiling_paint_type && (
          <DesignTitle
            sizeVariant="Subtitle"
            text={`سقف: ${PaintTypeDic[ceiling_paint_type]}`}
            titleVariant="Body"
            color="Gray500"
          />
        )}
        <div className="flex gap-1 ">
          <DesignTitle
            sizeVariant="Subtitle"
            text={`${Number(height).toString()} x`}
            titleVariant="Body"
            color="Gray500"
          />
          <DesignTitle
            sizeVariant="Subtitle"
            text={`${Number(width).toString()} x`}
            titleVariant="Body"
            color="Gray500"
          />
          <DesignTitle
            sizeVariant="Subtitle"
            text={`${Number(length).toString()}`}
            titleVariant="Body"
            color="Gray500"
          />
          <DesignTitle sizeVariant="Subtitle" text="متر" titleVariant="Body" color="Gray500" />
        </div>
      </div>
      <ConfirmModal
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        title="حذف برآورد"
        onConfirm={() => {
          if (selectedRoomId) {
            deleteDraftRoom(selectedRoomId);
          }
        }}
        description={
          <DesignTitle
            sizeVariant="Body"
            text="آیا از حذف این برآورد مطمئن هستید؟"
            titleVariant="Body"
            color="Gray500"
          />
        }
      />
    </div>
  );
}
