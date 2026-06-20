import { Button } from "@skul/sanjagh-design-system/src/Design_Button";
import { BottomSheet } from "@/components/common";
import { useState } from "react";
import EmptyState from "./EmptyState";
import BottomSheetContent from "./BottomSheetContent";
import RoomCard from "./RoomCard";

export default function CreateProjects() {
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const rooms = [
    { name: "پذیرایی", roofColorType: "پلاستیک", wallColorType: "روغن", length: 4, width: 3, height: 2.8 },
    { name: "پذیرایی", roofColorType: "پلاستیک", wallColorType: "روغن", length: 4, width: 3, height: 2.8 },
    { name: "پذیرایی", roofColorType: "پلاستیک", wallColorType: "روغن", length: 4, width: 3, height: 2.8 },
    { name: "پذیرایی", roofColorType: "پلاستیک", wallColorType: "روغن", length: 4, width: 3, height: 2.8 },
    { name: "پذیرایی", roofColorType: "پلاستیک", wallColorType: "روغن", length: 4, width: 3, height: 2.8 },
    { name: "پذیرایی", roofColorType: "پلاستیک", wallColorType: "روغن", length: 4, width: 3, height: 2.8 },
  ];

  return (
    <>
      <Button
        buttonVariant="SecondaryGrayButton"
        contentVariant={{ TAG: "Text", value: "افزودن اتاق" }}
        heightVariant="MDButton"
        widthVariant="FixedWidthButton"
        onClick={() => setBottomSheetOpen(true)}
      />
      {rooms.length ? (
        <div className="flex flex-col gap-3 mt-3.5">
          {rooms.map(room => (
            <RoomCard room={room} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
      <>
        <BottomSheet open={bottomSheetOpen} onClose={() => setBottomSheetOpen(false)}>
          <BottomSheetContent />
        </BottomSheet>
      </>
    </>
  );
}
