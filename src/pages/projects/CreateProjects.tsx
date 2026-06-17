import { Button } from "@skul/sanjagh-design-system/src/Design_Button";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { HouseColorized } from "../../assets/icons";
import { BottomSheet } from "../../components/common";
import { useState } from "react";

export default function CreateProjects() {
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const rooms = [];
  return (
    <div>
      <Button
        buttonVariant="SecondaryGrayButton"
        contentVariant={{ TAG: "Text", value: "افزودن اتاق" }}
        heightVariant="MDButton"
        widthVariant="FixedWidthButton"
        onClick={() => setBottomSheetOpen(true)}
      />
      {rooms.length ? (
        <></>
      ) : (
        <div className="flex flex-col gap-4 h-full items-center mt-20">
          <DesignTitle
            sizeVariant="SecondTitle"
            text="هیچ اتاقی اضافه نشده"
            titleVariant="SecondHeader"
            color="BlackMain"
          />

          <DesignTitle
            sizeVariant="ThirdTitle"
            text="برای شروع، یک اتاق اضافه کنید"
            titleVariant="SixthHeader"
            color="Gray400"
          />

          <HouseColorized />
        </div>
      )}
      <>
        <BottomSheet open={bottomSheetOpen} onClose={() => setBottomSheetOpen(false)}>
          <h2 className="text-xl font-bold">Settings</h2>

          <p className="mt-4">Some content...</p>
        </BottomSheet>
      </>
    </div>
  );
}
