import { Button } from "@skul/sanjagh-design-system/src/Design_Button";
import { BottomSheet } from "@/components/common";
import { useState } from "react";
import EmptyState from "./EmptyState";
import BottomSheetContent from "./BottomSheetContent";
import RoomCard from "./RoomCard";

export default function CreateProjects() {
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const rooms = [
    { id: 1, name: "پذیرایی", roofColorType: "پلاستیک", wallColorType: "روغن", length: 4, width: 3, height: 2.8 },
    { id: 2, name: "پذیرایی", roofColorType: "پلاستیک", wallColorType: "روغن", length: 4, width: 3, height: 2.8 },
    { id: 3, name: "پذیرایی", roofColorType: "پلاستیک", wallColorType: "روغن", length: 4, width: 3, height: 2.8 },
    { id: 4, name: "پذیرایی", roofColorType: "پلاستیک", wallColorType: "روغن", length: 4, width: 3, height: 2.8 },
    { id: 5, name: "پذیرایی", roofColorType: "پلاستیک", wallColorType: "روغن", length: 4, width: 3, height: 2.8 },
    { id: 6, name: "پذیرایی", roofColorType: "پلاستیک", wallColorType: "روغن", length: 4, width: 3, height: 2.8 },
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
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      <BottomSheet open={bottomSheetOpen} onClose={() => setBottomSheetOpen(false)}>
        <BottomSheetContent />
      </BottomSheet>
      {!!rooms.length && (
        <div className="fixed bottom-0 py-2 left-0 right-0 px-4 bg-white z-1 border border-white">
          <Button
            buttonVariant="PrimarySolidButton"
            contentVariant={{ TAG: "Text", value: "مشاهده نتایج" }}
            heightVariant="LGButton"
            widthVariant="FixedWidthButton"
          />
        </div>
      )}
    </>
  );
}
