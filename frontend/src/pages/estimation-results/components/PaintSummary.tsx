import { SettingsIcon } from "@/assets/icons";
import { TomanCounter } from "@/components/common";
import { Card } from "@skul/sanjagh-design-system/src/Design_Card";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Link } from "react-router-dom";
import type { EstimateFormValues } from "../schema";

export default function PaintSummary() {
  const { control, setValue } = useFormContext<EstimateFormValues>();

  const paints = useWatch({
    control,
    name: "paints",
  });

  const visibilityMaterials = useWatch({
    control,
    name: "visibility.materials",
  });

  const totalMaterialCost = useWatch({
    control,
    name: "totalMaterialCost",
  });

  if (!paints) {
    return null;
  }

  const paintItems = [
    {
      key: "plastic" as const,
      label: "رنگ پلاستیک",
    },
    {
      key: "oil" as const,
      label: "رنگ روغن",
    },
    {
      key: "acrylic" as const,
      label: "رنگ آکریلیک",
    },
  ];

  return (
    <Card extraClassName="border-2 border-design-gray-200" shadow="NoShadow" variant="SM">
      <div className="mb-1 flex items-center justify-between">
        <DesignTitle sizeVariant="ThirdTitle" text="نمایش جزییات رنگ ها" titleVariant="Body" color="BlackMain" />

        {/* <Controller
          name="visibility.materials"
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

      {visibilityMaterials && (
        <>
          <DesignTitle
            sizeVariant="Body"
            text="مشاهده تمام رنگ های استفاده شده در پروژه"
            titleVariant="Body"
            color="Gray500"
          />

          <Card extraClassName="mt-2 border-3 border-design-gray-200" shadow="NoShadow" variant="SM">
            <div className="mb-1 flex items-center justify-between">
              <DesignTitle sizeVariant="ThirdTitle" text="جزییات مصالح و لوازم" titleVariant="Body" color="BlackMain" />

              <Link to={`/settings/price-config?callback=/estimation-results`} className="flex gap-2">
                <DesignTitle sizeVariant="Subtitle" text="قیمت رنگ من" titleVariant="Body" color="BlueMain" />

                <SettingsIcon color="#3F93F3" />
              </Link>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="w-1/3">
                <DesignTitle sizeVariant="Subtitle" text="رنگ" titleVariant="Body" color="NewGreenMain" />
              </div>

              <div className="w-1/3 text-center">
                <DesignTitle sizeVariant="Subtitle" text="لیتر" titleVariant="Body" color="NewGreenMain" />
              </div>

              <div className="w-1/3 text-end">
                <DesignTitle sizeVariant="Subtitle" text="قیمت(تومان)" titleVariant="Body" color="NewGreenMain" />
              </div>
            </div>

            {paintItems.map(({ key, label }) => (
              <div key={key} className="my-1.5 flex items-center justify-between">
                <div className="w-1/3">
                  <DesignTitle sizeVariant="Body" text={label} titleVariant="Body" color="BlackMain" />
                </div>

                <div className="w-1/2 text-center">
                  <Controller
                    name={`paints.${key}.liters`}
                    control={control}
                    render={({ field }) => (
                      <TomanCounter
                        hasError={false}
                        initialCounterValue={field.value.toString()}
                        onCounterChange={({ value }) => {
                          field.onChange(value);

                          setValue(`paints.${key}.total_cost`, value * paints[key].price_per_liter);
                        }}
                        step={1}
                        size="sm"
                      />
                    )}
                  />
                </div>

                <div className="w-1/3 text-end">
                  <DesignTitle
                    sizeVariant="ThirdTitle"
                    text={paints[key].total_cost.toLocaleString()}
                    titleVariant="Body"
                    color="BlackMain"
                  />
                </div>
              </div>
            ))}

            <div className="my-1.5 flex items-center justify-between">
              <DesignTitle sizeVariant="Body" text="سایر ملزومات" titleVariant="Body" color="BlackMain" />

              <div className="w-[72%] text-center">
                <Controller
                  name="accessoriesCost"
                  control={control}
                  render={({ field }) => (
                    <TomanCounter
                      hasError={false}
                      initialCounterValue={field.value.toLocaleString()}
                      onCounterChange={({ value }) => {
                        field.onChange(value);
                      }}
                      step={500000}
                      size="sm"
                    />
                  )}
                />
              </div>
            </div>

            <div className="mt-1.5 flex items-center justify-between">
              <div className="w-1/3">
                <DesignTitle sizeVariant="ThirdTitle" text="جمع کل" titleVariant="Body" color="BlackMain" />
              </div>

              <div className="w-1/3 text-center">-</div>

              <div className="w-1/3 text-end">
                <DesignTitle
                  sizeVariant="ThirdTitle"
                  text={totalMaterialCost.toLocaleString()}
                  titleVariant="Body"
                  color="BlackMain"
                />
              </div>
            </div>
          </Card>
        </>
      )}
    </Card>
  );
}
