import { useCallback, useEffect, useRef } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDebounce } from "use-debounce";

import { Button } from "@skul/sanjagh-design-system/src/Design_Button";

import { pricingFormSchema, type PricingFormValues } from "./lib/schema";
import { pricingSections } from "./lib/config";
import { SectionBlock } from "./components/SectionBlock";

import { useUpdatePriceConfig } from "@/hooks/price-config/useUpdatePriceConfig";
import { usePriceConfig } from "@/hooks/price-config/usePriceConfig";

import { useNavigate, useSearchParams } from "react-router-dom";
import { Spinner } from "@/components/common";

export function PricingForm() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const { data: priceConfigData, isPending: getPriceConfigLoading } = usePriceConfig();

  const { mutateAsync: updatePriceAction, isPending } = useUpdatePriceConfig();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const callback = searchParams.get("callback");

  const isInitialized = useRef(false);
  const lastSavedPayloadRef = useRef<string | null>(null);
  const isSavingRef = useRef(false);
  const hasPendingChangesRef = useRef(false);

  const form = useForm<PricingFormValues>({
    resolver: yupResolver(pricingFormSchema),
    mode: "onBlur",
  });

  const { control, reset, handleSubmit, getValues } = form;

  useEffect(() => {
    if (getPriceConfigLoading || isInitialized.current) {
      return;
    }

    const initialValues: PricingFormValues = {
      acrylicLiter: {
        price: priceConfigData?.acrylic_per_liter ?? 0,
      },

      plasticLiter: {
        price: priceConfigData?.plastic_per_liter ?? 0,
      },

      oilLiter: {
        price: priceConfigData?.oil_per_liter ?? 0,
      },

      acrylicService: {
        min: priceConfigData?.acrylic_without_min ?? 0,
        max: priceConfigData?.acrylic_without_max ?? 0,
      },

      oilService: {
        min: priceConfigData?.oil_without_min ?? 0,
        max: priceConfigData?.oil_without_max ?? 0,
      },

      plasticService: {
        min: priceConfigData?.plastic_without_min ?? 0,
        max: priceConfigData?.plastic_without_max ?? 0,
      },
    };

    reset(initialValues);

    lastSavedPayloadRef.current = JSON.stringify({
      acrylic_per_liter: initialValues.acrylicLiter.price,
      acrylic_without_max: initialValues.acrylicService.max,
      acrylic_without_min: initialValues.acrylicService.min,
      oil_without_max: initialValues.oilService.max,
      oil_without_min: initialValues.oilService.min,
      plastic_without_max: initialValues.plasticService.max,
      plastic_without_min: initialValues.plasticService.min,
      oil_per_liter: initialValues.oilLiter.price,
      plastic_per_liter: initialValues.plasticLiter.price,
      currency: "تومان",
    });

    isInitialized.current = true;
  }, [priceConfigData, getPriceConfigLoading, reset]);

  const watchedValues = useWatch({
    control,
  });

  const [debouncedValues] = useDebounce(watchedValues, 3000);

  const createPayload = useCallback((values: PricingFormValues) => {
    if (
      !values.acrylicLiter ||
      !values.plasticLiter ||
      !values.oilLiter ||
      !values.acrylicService ||
      !values.oilService ||
      !values.plasticService
    ) {
      return null;
    }

    return {
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
    };
  }, []);

  const saveValues = useCallback(
    async (values: PricingFormValues) => {
      const payload = createPayload(values);

      if (!payload) {
        return false;
      }

      const payloadKey = JSON.stringify(payload);

      if (payloadKey === lastSavedPayloadRef.current) {
        return true;
      }

      if (isSavingRef.current) {
        hasPendingChangesRef.current = true;
        return false;
      }

      isSavingRef.current = true;
      hasPendingChangesRef.current = false;

      try {
        await updatePriceAction(payload);

        lastSavedPayloadRef.current = payloadKey;

        const currentValues = getValues();
        const currentPayload = createPayload(currentValues);
        const currentPayloadKey = currentPayload ? JSON.stringify(currentPayload) : null;

        if (currentPayloadKey === payloadKey) {
          reset(currentValues, {
            keepValues: true,
            keepDirty: false,
          });
        }

        return true;
      } finally {
        isSavingRef.current = false;

        if (hasPendingChangesRef.current) {
          hasPendingChangesRef.current = false;

          const latestValues = getValues();
          void saveValues(latestValues);
        }
      }
    },
    [createPayload, getValues, reset, updatePriceAction],
  );

  useEffect(() => {
    if (!isInitialized.current || !debouncedValues) {
      return;
    }

    void saveValues(debouncedValues as PricingFormValues);
  }, [debouncedValues, saveValues]);

  const onManualSubmit = handleSubmit(async values => {
    const saved = await saveValues(values);

    if (!saved) {
      return;
    }

    if (callback) {
      navigate(callback);
    } else {
      navigate(-1);
    }
  });

  return getPriceConfigLoading ? (
    <div className="flex min-h-75 items-center justify-center">
      <Spinner />
    </div>
  ) : (
    <FormProvider {...form}>
      <form dir="rtl" noValidate className="mx-auto flex w-full max-w-md flex-col gap-8 py-8">
        {pricingSections.map(section => (
          <SectionBlock key={section.key} section={section} />
        ))}

        {isPending && (
          <div className="fixed bottom-18 left-4">
            <Spinner className="size-4" />
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 z-10 border border-white bg-white px-4 py-2">
          <Button
            buttonVariant="PrimarySolidButton"
            contentVariant={{
              TAG: "Text",
              value: "ذخیره تغییرات",
            }}
            heightVariant="LGButton"
            widthVariant="FixedWidthButton"
            onClick={onManualSubmit}
          />
        </div>
      </form>
    </FormProvider>
  );
}
