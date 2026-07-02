import { HLine } from "@/components/common";
import { Card } from "@skul/sanjagh-design-system/src/Design_Card";
import Switch from "@skul/sanjagh-design-system/src/Design_Switch";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";

export default function CalculationWithMaterial() {
  return (
    <Card
      children={
        <>
          <div className="flex justify-between items-center">
            <div>
              <DesignTitle
                sizeVariant="ThirdTitle"
                text="نمایش محاسبه با مصالح"
                titleVariant="Body"
                color="BlackMain"
              />
              <DesignTitle sizeVariant="Body" text="شامل قیمت رنگ و موارد مصرفی" titleVariant="Body" color="Gray600" />
            </div>
            <Switch className="text-design-blue-1" label="نمایش" size="LG" checked={false} onCheckedChange={() => {}} />
          </div>
          <Card
            children={
              <div className="flex flex-col gap-1.5">
                <DesignTitle sizeVariant="ThirdTitle" text="قیمت نهایی" titleVariant="Body" color="BlackMain" />
                <div className="flex gap-1.5 items-center justify-end">
                  <span className="text-4xl font-bold">12</span>
                  <DesignTitle
                    sizeVariant="ThirdTitle"
                    text="میلیون تومان"
                    titleVariant="ThirdHeader"
                    color="BlackMain"
                  />
                </div>
                <div className="flex justify-end">
                  <DesignTitle sizeVariant="Body" text="تنظیم قیمت در بازه من" titleVariant="Body" color="Gray500" />
                </div>
                <div>
                  <HLine />
                </div>
                <div className="flex gap-1.5 items-center justify-between">
                  <DesignTitle sizeVariant="Body" text="بیشترین" titleVariant="Body" color="Gray600" />
                  <DesignTitle sizeVariant="Body" text="کمترین" titleVariant="Body" color="Gray600" />
                </div>
              </div>
            }
            extraClassName="border-2 border-design-gray-200 mt-3"
            shadow="NoShadow"
            variant="SM"
          />
        </>
      }
      extraClassName="border-2 border-design-gray-200"
      shadow="NoShadow"
      variant="SM"
    />
  );
}
