import { Button } from "@skul/sanjagh-design-system/src/Design_Button";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { HouseColorized } from "@/assets/icons";
import { BottomSheet, ButtonList, HLine } from "@/components/common";
import { useState } from "react";

export default function CreateProjects() {
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const rooms = [];
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
          <div className="flex justify-center">
            <DesignTitle sizeVariant="FirstTitle" text="افزودن اتاق" titleVariant="Body" />
          </div>
          <ButtonList
            list={[
              { title: "اتاق خواب", value: "bedroom" },
              { title: "پذیرایی", value: "living_room" },
              { title: "سرویس", value: "bathroom" },
              { title: "آشپزخانه", value: "kitchen" },
              { title: "سایر", value: "other" },
              { title: "راهرو", value: "hallway" },
            ]}
            onChange={value => {
              console.log("🚀 ~ CreateProjects ~ value:", value);
            }}
            defaultValue="other"
            className="grid grid-cols-2 gap-x-3 gap-y-4 mt-4"
          />
          <HLine />
          <DesignTitle sizeVariant="FirstTitle" text="رنگ دیوار" titleVariant="Body" />
          <ButtonList
            list={[
              { title: "آکریلیک", value: "acrylic" },
              { title: "روغن", value: "oil_based" },
              { title: "پلاستیک", value: "plastic_emulsion" },
            ]}
            onChange={value => {
              console.log("🚀 ~ CreateProjects ~ value:", value);
            }}
            defaultValue="other"
            className="grid grid-cols-2 gap-x-3 gap-y-4 mt-1"
          />
          <HLine />
        </BottomSheet>
      </>
    </>
  );
}
