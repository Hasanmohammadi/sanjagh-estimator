import { TomanCounter } from "@/components/common";
import { Card } from "@skul/sanjagh-design-system/src/Design_Card";
import Switch from "@skul/sanjagh-design-system/src/Design_Switch";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { useFormContext } from "react-hook-form";
import type { EstimateFormValues } from "../schema";

export default function Period() {
  const { getValues, setValue } = useFormContext<EstimateFormValues>();

  return (
    <Card
      children={
        <>
          <div className="flex justify-between items-center">
            <div>
              <DesignTitle sizeVariant="ThirdTitle" text="مدت زمان" titleVariant="Body" color="BlackMain" />
            </div>
            <Switch
              className="text-design-blue-1"
              label="نمایش"
              size="LG"
              checked={getValues("visibility.days")}
              onCheckedChange={checked => {
                setValue("visibility.days", checked);
              }}
            />
          </div>
          {getValues("visibility.days") && (
            <>
              <div className="mt-1.5 flex justify-between items-center">
                <div></div>
                <TomanCounter
                  className="w-1/2"
                  hasError={false}
                  initialCounterValue={String(getValues("days"))}
                  onCounterChange={payload => setValue("days", payload.value)}
                  step={1}
                  min={1}
                />
                <DesignTitle sizeVariant="ThirdTitle" text="روز" titleVariant="Body" color="BlackMain" />
              </div>
              <DesignTitle
                sizeVariant="Body"
                text={`برآورد: ${getValues("days")} روز`}
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
