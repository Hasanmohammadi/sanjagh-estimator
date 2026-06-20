import { EditIcon, RemoveIcon } from "@/assets/icons";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";

interface RoomI {
  name: string;
  roofColorType: string;
  wallColorType: string;
  length: number;
  width: number;
  height: number;
}

interface Props {
  room: RoomI;
}

export default function RoomCard({ room: { height, length, roofColorType, wallColorType, width, name } }: Props) {
  return (
    <div className="border border-design-gray-200 p-3 pt-6 rounded-lg">
      <div className="flex justify-between">
        <DesignTitle sizeVariant="SecondTitle" text={name} titleVariant="Body" color="BlackMain" />
        <div className="flex justify-end gap-2 items-center">
          <div className="bg-design-gray-100 p-2.5 rounded-xl">
            <EditIcon />
          </div>
          <div className="bg-red-100 p-2.5 rounded-xl">
            <RemoveIcon />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-3">
        <DesignTitle sizeVariant="Body" text={`سقف: ${wallColorType}`} titleVariant="Body" color="Gray500" />
        <DesignTitle sizeVariant="Body" text={`دیوار: ${roofColorType}`} titleVariant="Body" color="Gray500" />
        <DesignTitle sizeVariant="Body" text={`متر ${height}x${length}x${width}`} titleVariant="Body" color="Gray500" />
      </div>
    </div>
  );
}
