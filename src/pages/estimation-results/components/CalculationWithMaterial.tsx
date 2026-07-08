import { PriceSlider } from "@/components/common";
import { Card } from "@skul/sanjagh-design-system/src/Design_Card";
import Switch from "@skul/sanjagh-design-system/src/Design_Switch";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { useState } from "react";

export default function CalculationWithMaterial() {
  const [price, setPrice] = useState(12);
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
            children={<PriceSlider min={10} max={14} step={1} value={price} onValueChange={setPrice} />}
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
