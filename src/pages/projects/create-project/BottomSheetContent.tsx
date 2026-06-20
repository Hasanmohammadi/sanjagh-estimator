import { ButtonList, TomanCounter, HLine } from "@/components/common";
import { Button } from "@skul/sanjagh-design-system/src/Design_Button";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import Switch from "@skul/sanjagh-design-system/src/Design_Switch";
import { useState } from "react";

export const ROOM_TYPES = [
  { title: "اتاق خواب", value: "bedroom" },
  { title: "پذیرایی", value: "living_room" },
  { title: "سرویس", value: "bathroom" },
  { title: "آشپزخانه", value: "kitchen" },
  { title: "سایر", value: "other" },
  { title: "راهرو", value: "hallway" },
];

export const PAINT_TYPES = [
  { title: "آکریلیک", value: "acrylic" },
  { title: "روغن", value: "oil_based" },
  { title: "پلاستیک", value: "plastic_emulsion" },
];

export default function BottomSheetContent() {
  const [hasRoofColor, setHasRoofColor] = useState(false);

  return (
    <div className="mb-20">
      <div className="flex justify-center">
        <DesignTitle sizeVariant="FirstTitle" text="افزودن اتاق" titleVariant="Body" />
      </div>

      <ButtonList
        list={ROOM_TYPES}
        onChange={value => {
          console.log("🚀 ~ CreateProjects ~ value:", value);
        }}
        defaultValue="other"
        className="grid grid-cols-2 gap-x-3 gap-y-4 mt-4"
      />

      <HLine />

      <div className="flex flex-col gap-3 ">
        <div className="flex justify-between gap-2 items-center">
          <DesignTitle sizeVariant="Body" text="طول(متر)" titleVariant="Body" />
          <TomanCounter
            hasError={false}
            initialCounterValue="0"
            onCounterChange={value => console.log(value)}
            step={1}
          />
        </div>
        <div className="flex justify-between gap-2 items-center">
          <DesignTitle sizeVariant="Body" text="عرض(متر)" titleVariant="Body" />
          <TomanCounter
            hasError={false}
            initialCounterValue="0"
            onCounterChange={value => console.log(value)}
            step={1}
          />
        </div>
        <div className="flex justify-between gap-2 items-center">
          <DesignTitle sizeVariant="Body" text="ارتفاع(متر)" titleVariant="Body" />
          <TomanCounter
            hasError={false}
            initialCounterValue="0"
            onCounterChange={value => console.log(value)}
            step={1}
          />
        </div>
      </div>

      <HLine />

      <DesignTitle sizeVariant="FirstTitle" text="رنگ دیوار" titleVariant="Body" />
      <ButtonList
        list={PAINT_TYPES}
        onChange={value => {
          console.log("🚀 ~ CreateProjects ~ value:", value);
        }}
        defaultValue="other"
        className="grid grid-cols-3 gap-x-4 mt-1"
      />

      <div className="flex justify-between gap-2 items-center mt-6">
        <input className="border w-1/2" />
        <DesignTitle sizeVariant="FirstTitle" text="تعداد دست دیوار" titleVariant="Body" />
      </div>

      <HLine />

      <div className="fixed bottom-0 py-2 left-0 right-0 px-4 bg-white z-1 border border-white">
        <Button
          buttonVariant="PrimarySolidButton"
          contentVariant={{ TAG: "Text", value: "ذخیره اتاق" }}
          heightVariant="LGButton"
          widthVariant="FixedWidthButton"
        />
      </div>

      <div className="border-2 border-design-gray-200 rounded-lg flex justify-between px-4 py-3">
        <DesignTitle sizeVariant="SecondTitle" text="رنگ سقف" titleVariant="Body" />
        <Switch label=" " checked={hasRoofColor} onCheckedChange={checked => setHasRoofColor(checked)} size="LG" />
      </div>

      {hasRoofColor && (
        <>
          <ButtonList
            list={PAINT_TYPES}
            onChange={value => {
              console.log("🚀 ~ CreateProjects ~ value:", value);
            }}
            defaultValue="other"
            className="grid grid-cols-3 gap-x-4 mt-4"
          />
          <div className="flex justify-between gap-2 items-center mt-6">
            <input className="border w-1/2" />
            <DesignTitle sizeVariant="FirstTitle" text="تعداد دست سقف" titleVariant="Body" />
          </div>
        </>
      )}

      <div className="mt-6">
        <DesignTitle
          sizeVariant="Body"
          text="اطلاعات وارد شده برای محاسبه دقیق مساحت رنگ‌آمیزی و برآورد هزینه استفاده می‌شود."
          titleVariant="Body"
          color="Gray600"
        />
      </div>
    </div>
  );
}
