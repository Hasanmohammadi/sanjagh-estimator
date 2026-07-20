import { Card } from "@skul/sanjagh-design-system/src/Design_Card";
import Switch from "@skul/sanjagh-design-system/src/Design_Switch";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { useFormContext } from "react-hook-form";
import type { EstimateFormValues } from "../schema";

export default function PaintArea() {
  const { getValues, setValue } = useFormContext<EstimateFormValues>();

  return (
    <Card
      children={
        <>
          <div className="flex justify-between items-center">
            <div>
              <DesignTitle sizeVariant="ThirdTitle" text="متر رنگ آمیزی" titleVariant="Body" color="BlackMain" />
            </div>
            <Switch
              className="text-design-blue-1"
              label="نمایش"
              size="LG"
              checked={getValues("visibility.paint_area")}
              onCheckedChange={checked => {
                setValue("visibility.paint_area", checked);
              }}
            />
          </div>
          {getValues("visibility.paint_area") && (
            <>
              <div className="mt-2 flex justify-end items-center gap-7">
                <span className="text-4xl font-bold">{Math.ceil(getValues("meterage") || 0)}</span>
                <DesignTitle sizeVariant="ThirdTitle" text="متر مربع" titleVariant="Body" color="BlackMain" />
              </div>
              <DesignTitle
                sizeVariant="Body"
                text={`برآورد: (${getValues("meterage")})متر مربع`}
                titleVariant="Body"
                color="Gray600"
              />
            </>
          )}
        </>
      }
      extraClassName="border-2 border-design-gray-200"
      shadow="NoShadow"
      variant="SM"
    />
  );
}
