import { Card } from "@skul/sanjagh-design-system/src/Design_Card";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { useFormContext, useWatch } from "react-hook-form";
import type { EstimateFormValues } from "../schema";

export default function PaintArea() {
  const { control } = useFormContext<EstimateFormValues>();

  const meterage = useWatch({
    control,
    name: "meterage",
  });

  const isPaintAreaVisible = useWatch({
    control,
    name: "visibility.paint_area",
  });

  return (
    <Card
      children={
        <>
          <div className="flex items-center justify-between">
            <DesignTitle sizeVariant="ThirdTitle" text="متر رنگ آمیزی" titleVariant="Body" color="BlackMain" />

            {/* <Controller
              name="visibility.paint_area"
              control={control}
              render={({ field }) => (
                <Switch
                  className="text-design-blue-1"
                  label="نمایش"
                  size="LG"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            /> */}
          </div>

          {isPaintAreaVisible && (
            <>
              <div className="mt-2 flex items-center justify-center gap-7">
                <div className="w-1/4" />
                <span className="text-4xl font-bold">{Math.ceil(meterage || 0)}</span>
                <DesignTitle sizeVariant="ThirdTitle" text="متر مربع" titleVariant="Body" color="BlackMain" />
              </div>

              <DesignTitle
                sizeVariant="Body"
                text={`برآورد: (${meterage})متر مربع`}
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
