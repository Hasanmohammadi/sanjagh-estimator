import { Card } from "@skul/sanjagh-design-system/src/Design_Card";
import { TextField } from "@skul/sanjagh-design-system/src/Design_TextField";
import { TextArea } from "@skul/sanjagh-design-system/src/Design_TextArea";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { Controller, useFormContext } from "react-hook-form";
import type { EstimateFormValues } from "../schema";

export default function UserInfo() {
  const {
    control,
    formState: { errors },
  } = useFormContext<EstimateFormValues>();

  return (
    <Card
      children={
        <>
          <DesignTitle sizeVariant="ThirdTitle" text="اطلاعات مشتری" titleVariant="Body" color="BlackMain" />
          <DesignTitle sizeVariant="SmallBody" text="نام مشتری" titleVariant="Body" color="BlackMain" />

          <Controller
            name="customerName"
            control={control}
            render={({ field }) => (
              <TextField
                backgroundVariant="Outlined"
                heightVariant="MDTextField"
                onTextChanged={field.onChange}
                value={field.value}
                className="mt-2 border border-design-gray-200"
              />
            )}
          />

          {errors.customerName?.message && (
            <DesignTitle
              sizeVariant="SmallBody"
              text={errors.customerName.message}
              titleVariant="Caption"
              color="RedMain"
            />
          )}

          <div className="mt-3">
            <DesignTitle sizeVariant="SmallBody" text="سایر توضیحات" titleVariant="Body" color="BlackMain" />

            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextArea
                  inputTypeVariant="Normal"
                  backgroundVariant="Outlined"
                  heightVariant="MDTextField"
                  onTextChanged={field.onChange}
                  value={field.value || ""}
                  className="mt-2 border border-design-gray-200"
                  placeholder="توضیحات خود درباره جزییات رنگ آمیزی را اینجا بنویسید."
                />
              )}
            />

            {errors.notes?.message && (
              <DesignTitle sizeVariant="SmallBody" text={errors.notes.message} titleVariant="Caption" color="RedMain" />
            )}
          </div>
        </>
      }
      extraClassName="border-3 border-design-gray-200 mt-2"
      shadow="NoShadow"
      variant="SM"
    />
  );
}
