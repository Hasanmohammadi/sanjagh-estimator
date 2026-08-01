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
  const { data: priceConfigData, isPending: getPriceConfigLoading } = usePriceConfig();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const callback = searchParams.get("callback");

  const isInitialized = useRef(false);

  const lastSubmittedRef = useRef<string | null>(null);

  const isManualSubmitRef = useRef(false);

  const form = useForm<PricingFormValues>({
    resolver: yupResolver(pricingFormSchema),
    mode: "onBlur",
  });

  const {
    control,
    reset,
    handleSubmit,
    getValues,
    formState: { isDirty },
  } = form;

  const { mutate: updatePriceAction, isPending } = useUpdatePriceConfig({
    onSuccess: () => {
      reset(getValues(), { keepValues: true, keepDirty: false });

      if (isManualSubmitRef.current) {
        isManualSubmitRef.current = false;
        navigate(-1);
      }
    },
  });

  /**
   * مقدار اولیه فرم را وقتی لودینگ تمام شد ست می‌کنیم، حتی اگر priceConfigData
   * خالی/نال باشه (یعنی هنوز هیچ قیمتی ثبت نشده) — اینطوری isInitialized
   * همیشه true میشه و auto-save از همون ادیت اول هم کار می‌کنه.
   */
  useEffect(() => {
    if (getPriceConfigLoading || isInitialized.current) {
      return;
    }

    reset({
      acrylicLiter: {
        price: priceConfigData?.acrylic_per_liter,
      },

      plasticLiter: {
        price: priceConfigData?.plastic_per_liter,
      },

      oilLiter: {
        price: priceConfigData?.oil_per_liter,
      },

      acrylicService: {
        min: priceConfigData?.acrylic_without_min,
        max: priceConfigData?.acrylic_without_max,
      },

      oilService: {
        min: priceConfigData?.oil_without_min,
        max: priceConfigData?.oil_without_max,
      },

      plasticService: {
        min: priceConfigData?.plastic_without_min,
        max: priceConfigData?.plastic_without_max,
      },
    });

    isInitialized.current = true;
  }, [priceConfigData, getPriceConfigLoading, reset]);

  const watchedValues = useWatch({
    control,
  });

  const [debouncedValues] = useDebounce(watchedValues, 3000);

  const submitForm = useCallback(
    (values: PricingFormValues, isManual: boolean) => {
      if (
        !values?.acrylicLiter ||
        !values?.plasticLiter ||
        !values?.oilLiter ||
        !values?.acrylicService ||
        !values?.oilService ||
        !values?.plasticService
      ) {
        return;
      }

      const payload = {
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

      // Skip sending the exact same payload twice in a row.
      const payloadKey = JSON.stringify(payload);
      if (payloadKey === lastSubmittedRef.current) {
        return;
      }
      lastSubmittedRef.current = payloadKey;

      isManualSubmitRef.current = isManual;

      updatePriceAction(payload);
    },
    [updatePriceAction],
  );

  useEffect(() => {
    if (!isInitialized.current) {
      return;
    }

    if (!isDirty) {
      return;
    }

    if (isPending) {
      return;
    }

    if (!debouncedValues) {
      return;
    }

    submitForm(debouncedValues as PricingFormValues, false);
  }, [debouncedValues, isDirty, submitForm]);

  const onManualSubmit = handleSubmit(values => {
    if (!isDirty) {
      if (callback) {
        navigate(callback);
      } else navigate(-1);
      return;
    }

    submitForm(values, true);
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
          <div className="fixed bottom-18 left-4 ">
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
