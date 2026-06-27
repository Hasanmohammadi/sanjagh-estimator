import { PaintTypeDic, RoomTypeDic, type Room } from "@/api/services/rooms";
import { EditIcon, RemoveIcon } from "@/assets/icons";
import { useDeleteRoom } from "@/hooks/rooms/useDeleteRoom";
import { queryKeys } from "@/lib/queryKeys";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  room: Room;
  onEdit: () => void;
}

export default function RoomCard({
  room: { height, length, type, wall_paint_type, width, ceiling_paint_type, id, project_id },
  onEdit,
}: Props) {
  const queryClient = useQueryClient();

  const { mutate: deleteRoom } = useDeleteRoom({
    projectId: project_id,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.project(project_id),
      });
    },
  });

  return (
    <div className="border border-design-gray-200 p-3 pt-6 rounded-lg">
      <div className="flex justify-between">
        <DesignTitle sizeVariant="SecondTitle" text={RoomTypeDic[type]} titleVariant="Body" color="BlackMain" />
        <div className="flex justify-end gap-2 items-center">
          <div className="bg-design-gray-100 p-2.5 rounded-xl" onClick={onEdit}>
            <EditIcon />
          </div>
          <div className="bg-red-100 p-2.5 rounded-xl" onClick={() => deleteRoom(id)}>
            <RemoveIcon />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-3">
        {!!ceiling_paint_type && (
          <DesignTitle
            sizeVariant="Body"
            text={`سقف: ${PaintTypeDic[ceiling_paint_type]}`}
            titleVariant="Body"
            color="Gray500"
          />
        )}
        <DesignTitle
          sizeVariant="Body"
          text={`دیوار: ${PaintTypeDic[wall_paint_type]}`}
          titleVariant="Body"
          color="Gray500"
        />
        <div className="flex gap-1 ">
          <DesignTitle sizeVariant="Body" text={`${Number(height).toString()} x`} titleVariant="Body" color="Gray500" />
          <DesignTitle sizeVariant="Body" text={`${Number(width).toString()} x`} titleVariant="Body" color="Gray500" />
          <DesignTitle sizeVariant="Body" text={`${Number(length).toString()}`} titleVariant="Body" color="Gray500" />
          <DesignTitle sizeVariant="Body" text="متر" titleVariant="Body" color="Gray500" />
        </div>
      </div>
    </div>
  );
}
