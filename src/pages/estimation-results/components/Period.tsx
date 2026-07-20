import { TomanCounter } from "@/components/common";
import { Card } from "@skul/sanjagh-design-system/src/Design_Card";
import Switch from "@skul/sanjagh-design-system/src/Design_Switch";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { EstimateFormValues } from "../schema";

export default function Period() {
  const { control } = useFormContext<EstimateFormValues>();

  const isDaysVisible = useWatch({
    control,
    name: "visibility.days",
  });

  const days = useWatch({
    control,
    name: "days",
  });

  return (
    <Card extraClassName="border-2 border-design-gray-200" shadow="NoShadow" variant="SM">
      <div className="flex items-center justify-between">
        <DesignTitle sizeVariant="ThirdTitle" text="مدت زمان" titleVariant="Body" color="BlackMain" />

        <Controller
          name="visibility.days"
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
        />
      </div>

      {isDaysVisible && (
        <>
          <div className="mt-1.5 flex items-center justify-between">
            <div />

            <Controller
              name="days"
              control={control}
              render={({ field }) => (
                <TomanCounter
                  className="w-1/2"
                  hasError={false}
                  initialCounterValue={String(field.value)}
                  onCounterChange={({ value }) => field.onChange(value)}
                  step={1}
                  min={1}
                />
              )}
            />

            <DesignTitle sizeVariant="ThirdTitle" text="روز" titleVariant="Body" color="BlackMain" />
          </div>

          <DesignTitle sizeVariant="Body" text={`برآورد: ${days} روز`} titleVariant="Body" color="Gray600" />
        </>
      )}
    </Card>
  );
}
