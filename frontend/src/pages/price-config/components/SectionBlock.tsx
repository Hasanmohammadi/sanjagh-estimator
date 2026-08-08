import { useFormContext } from "react-hook-form";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { HLine } from "@/components/common";
import type { PricingSection } from "../lib/config";
import type { PricingFormValues } from "../lib/schema";
import { ItemCard } from "./ItemCard";

export function SectionBlock({ section }: { section: PricingSection }) {
  const { control } = useFormContext<PricingFormValues>();

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-center gap-3">
        {section.icon}
        <DesignTitle sizeVariant="SecondTitle" text={section.title} titleVariant="Body" color="BlackMain" />
      </header>

      <div className="flex flex-col gap-4">
        {section.items.map(item => (
          <ItemCard key={item.key} section={section} item={item} control={control} />
        ))}
      </div>

      <HLine />
    </section>
  );
}
