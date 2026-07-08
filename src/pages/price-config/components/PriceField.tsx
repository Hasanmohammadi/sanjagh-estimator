"use client";

import { Controller, type Control } from "react-hook-form";
import TextField from "@skul/sanjagh-design-system/src/Design_TextField";
import type { PricingFormValues } from "../lib/schema";

export function PriceField({
  control,
  name,
  placeholder,
}: {
  control: Control<PricingFormValues>;
  /** dot-path field name, e.g. "plastic_liter.price" */
  name: string;
  placeholder: string;
}) {
  return (
    <Controller
      control={control}
      // dynamic schema keys aren't in the inferred type, so cast the name
      name={name as never}
      render={({ field, fieldState }) => (
        <div className="mt-2 flex flex-col gap-1">
          <TextField
            backgroundVariant="Outlined"
            heightVariant="MDTextField"
            value={field.value == null ? "" : String(field.value)}
            onTextChanged={(text: string) => field.onChange(text)}
            className="border border-design-gray-200 h-10 pl-2"
            placeholder={placeholder}
            leftContent={{ TAG: "Text", value: "تومان" }}
            isAutoFocus={false}
            inputMode="numeric"
          />

          {fieldState.error?.message && (
            <p role="alert" className="text-xs text-design-red">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
