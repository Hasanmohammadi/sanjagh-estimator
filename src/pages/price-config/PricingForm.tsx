"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@skul/sanjagh-design-system/src/Design_Button";
import { pricingFormSchema, type PricingFormValues } from "./lib/schema";
import { pricingSections } from "./lib/config";
import { SectionBlock } from "./components/SectionBlock";
import { useUpdatePriceConfig } from "@/hooks/price-config/useUpdatePriceConfig";
import { usePriceConfig } from "@/hooks/price-config/usePriceConfig";

export function PricingForm() {
  const { data: priceConfigData } = usePriceConfig();

  const { mutate: updatePriceAction, isPending } = useUpdatePriceConfig();

  const { control, handleSubmit } = useForm<PricingFormValues>({
    resolver: yupResolver(pricingFormSchema),
    mode: "onBlur",
    values: priceConfigData
      ? {
          acrylicLiter: {
            price: priceConfigData.acrylic_per_liter,
          },
          plasticLiter: {
            price: priceConfigData.plastic_per_liter,
          },
          oilLiter: {
            price: priceConfigData.oil_per_liter,
          },
          acrylicService: {
            min: priceConfigData.acrylic_without_min,
            max: priceConfigData.acrylic_without_max,
          },
          oilService: {
            min: priceConfigData.oil_without_min,
            max: priceConfigData.oil_without_max,
          },
          plasticService: {
            min: priceConfigData.plastic_without_min,
            max: priceConfigData.plastic_without_max,
          },
        }
      : undefined,
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  function onSubmit(values: PricingFormValues) {
    updatePriceAction({
      acrylic_per_liter: values.acrylicLiter.price,
      acrylic_without_max: values.acrylicService.max,
      acrylic_without_min: values.acrylicService.min,
      oil_without_max: values.oilService.max,
      oil_without_min: values.oilService.min,
      plastic_without_max: values.plasticService.max,
      plastic_without_min: values.plasticService.min,
      oil_per_liter: values.oilLiter.price,
      plastic_per_liter: values.plasticLiter.price,
      currency: "تومان",
    });
  }

  return (
    <form dir="rtl" noValidate className="mx-auto flex w-full max-w-md flex-col gap-8 py-8">
      {pricingSections.map(section => (
        <SectionBlock key={section.key} section={section} control={control} />
      ))}

      <div className="fixed bottom-0 left-0 right-0 z-10 border border-white bg-white px-4 py-2">
        <Button
          buttonVariant="PrimarySolidButton"
          contentVariant={{ TAG: "Text", value: "ذخیره تغییرات" }}
          heightVariant="LGButton"
          widthVariant="FixedWidthButton"
          disabled={isPending}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </form>
  );
}
