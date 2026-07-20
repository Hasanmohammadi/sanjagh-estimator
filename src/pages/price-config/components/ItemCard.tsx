"use client";

import type { Control } from "react-hook-form";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { Card } from "@skul/sanjagh-design-system/src/Design_Card";
import type { PricingItem, PricingSection } from "../lib/config";
import type { PricingFormValues } from "../lib/schema";
import { PriceField } from "./PriceField";

export function ItemCard({
  section,
  item,
  control,
}: {
  section: PricingSection;
  item: PricingItem;
  control: Control<PricingFormValues>;
}) {
  return (
    <Card
      children={
        <>
          <DesignTitle sizeVariant="ThirdTitle" text={item.label} titleVariant="Body" color="BlackMain" />

          {section.variant === "single" ? (
            <PriceField control={control} name={`${item.key}.price`} placeholder={section.priceLabel} />
          ) : (
            <>
              <PriceField control={control} name={`${item.key}.min`} placeholder={section.minLabel} />
              <PriceField control={control} name={`${item.key}.max`} placeholder={section.maxLabel} />
            </>
          )}
        </>
      }
      extraClassName="border-2 border-design-gray-100"
      shadow="Low"
      variant="SM"
    />
  );
}
