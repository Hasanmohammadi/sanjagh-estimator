import { PriceSlider } from "@/components/common";
import { Card } from "@skul/sanjagh-design-system/src/Design_Card";
import Switch from "@skul/sanjagh-design-system/src/Design_Switch";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { useFormContext, useWatch } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import type { EstimateFormValues } from "../schema";

export default function CalculationWithMaterial() {
  const { setValue, control } = useFormContext<EstimateFormValues>();

  const totalCost = useWatch({
    control,
    name: "totalCost",
  });

  const finalCostVisibility = useWatch({
    control,
    name: "visibility.final_cost",
  });

  const [materialBasedTotalCost, setMaterialBasedTotalCost] = useState<number | null>(null);

  const isSliderChange = useRef(false);

  useEffect(() => {
    if (!isSliderChange.current && totalCost != null) {
      setMaterialBasedTotalCost(totalCost);
    }
    isSliderChange.current = false;
  }, [totalCost]);

  const handleSliderChange = (value: number) => {
    isSliderChange.current = true;
    setValue("totalCost", value);
  };

  const min = materialBasedTotalCost != null ? materialBasedTotalCost - 2 : 0;
  const max = materialBasedTotalCost != null ? materialBasedTotalCost + 2 : 100;

  return (
    <Card extraClassName="border-2 border-design-gray-200" shadow="NoShadow" variant="SM">
      <div className="flex items-center justify-between">
        <div>
          <DesignTitle sizeVariant="ThirdTitle" text="نمایش محاسبه با مصالح" titleVariant="Body" color="BlackMain" />
          <DesignTitle sizeVariant="Body" text="شامل قیمت رنگ و موارد مصرفی" titleVariant="Body" color="Gray600" />
        </div>

        <Switch
          className="text-design-blue-1"
          label="نمایش"
          size="LG"
          checked={finalCostVisibility}
          onCheckedChange={checked => {
            setValue("visibility.final_cost", checked);
          }}
        />
      </div>
      {finalCostVisibility && (
        <>
          {materialBasedTotalCost != null && (
            <Card extraClassName="mt-3 border-2 border-design-gray-200" shadow="NoShadow" variant="SM">
              <PriceSlider
                min={min}
                max={max}
                step={1}
                value={totalCost ?? materialBasedTotalCost}
                onValueChange={handleSliderChange}
              />
            </Card>
          )}
        </>
      )}
    </Card>
  );
}
