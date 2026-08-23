import CalculationWithMaterial from "./components/CalculationWithMaterial";
import PriceConfig from "./components/PriceConfig";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import Period from "./components/Period";
import PaintArea from "./components/PaintArea";
import PaintSummary from "./components/PaintSummary";
import UserInfo from "./components/UserInfo";
import { useEffect, useRef } from "react";
import { estimateSchema } from "./schema";
import { Button } from "@skul/sanjagh-design-system/src/Design_Button";
import { Spinner } from "@/components/common";
import { useDraftCalculate } from "@/hooks/draft/useDraftCalculate";
import { useCompleteDraft } from "@/hooks/draft/useCompleteDraft";

export default function EstimationResult() {
  const navigate = useNavigate();
  const customerNameRef = useRef<HTMLInputElement>(null);

  const { data: draftCalculate, isLoading } = useDraftCalculate();

  const form = useForm({
    resolver: yupResolver(estimateSchema),
    shouldFocusError: true,
    defaultValues: {
      customerName: "",
      notes: "",
      visibility: {
        days: true,
        final_cost: true,
        materials: true,
        paint_area: true,
      },
    },
  });

  const onError = () => {
    if (form.formState.errors.customerName) {
      customerNameRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      customerNameRef.current?.focus();
    }
  };

  useEffect(() => {
    if (draftCalculate) {
      form.reset({
        totalCost: Math.ceil((draftCalculate.calculation.final_cost / 1_000_000) * 2) / 2,
        maxTotalPrice: Math.ceil((draftCalculate.calculation.max_total_price / 1_000_000) * 2) / 2,
        minTotalPrice: Math.ceil((draftCalculate.calculation.min_total_price / 1_000_000) * 2) / 2,
        totalMaterialCost: draftCalculate.calculation.materials.total_materials_cost,
        accessoriesCost: draftCalculate.calculation.materials.accessories_cost,
        paints: draftCalculate.calculation.materials.paints,
        meterage: draftCalculate.calculation.paint_area,
        days: draftCalculate.calculation.days,
        notes: "",
        visibility: {
          days: true,
          final_cost: true,
          materials: true,
          paint_area: true,
        },
      });
    }
  }, [draftCalculate, form]);

  const [accessoriesCost, acrylicCost, oilCost, plasticCost] = useWatch({
    control: form.control,
    name: ["accessoriesCost", "paints.acrylic.total_cost", "paints.oil.total_cost", "paints.plastic.total_cost"],
  });

  const BASE_COST = draftCalculate
    ? draftCalculate?.calculation.final_cost - draftCalculate?.calculation.materials.total_materials_cost
    : null;

  useEffect(() => {
    const totalMaterials = (accessoriesCost || 0) + (acrylicCost || 0) + (oilCost || 0) + (plasticCost || 0);
    form.setValue("totalMaterialCost", totalMaterials);

    if (BASE_COST) {
      const finalTotal = BASE_COST + totalMaterials;
      form.setValue("totalCost", Math.ceil((finalTotal / 1_000_000) * 2) / 2);
    }

    form.watch();
  }, [accessoriesCost, acrylicCost, oilCost, plasticCost, form.setValue]);

  const { mutate: completeDraftAction, isPending: completeDraftLoading } = useCompleteDraft({
    onSuccess: project => navigate(`/final-estimation?projectId=${project?.id}`),
  });

  const onSubmit = () => {
    completeDraftAction({
      accessoriesCost: form.getValues("accessoriesCost"),
      customerName: form.getValues("customerName"),
      days: form.getValues("days"),
      meterage: form.getValues("meterage"),
      notes: form.getValues("notes"),
      paints: form.getValues("paints"),
      totalCost: form.getValues("totalCost") * 1000000,
      totalMaterialCost: form.getValues("totalMaterialCost"),
      visibility: form.getValues("visibility"),
    });
  };

  return isLoading ? (
    <div className="flex min-h-75 items-center justify-center">
      <Spinner />
    </div>
  ) : (
    <FormProvider {...form}>
      <div className="flex flex-col gap-2.5">
        <PriceConfig />
        <CalculationWithMaterial />
        <Period />
        <PaintArea />
        <PaintSummary />
        <UserInfo customerNameRef={customerNameRef} />{" "}
        <div className="fixed bottom-0 left-0 right-0 px-4 py-4 shadow-design-black-1 shadow-2xl rounded-t-3xl bg-white border border-white z-10">
          <Button
            buttonVariant="PrimarySolidButton"
            contentVariant={{
              TAG: "Text",
              value: "ذخیره و ارسال برآورد",
            }}
            heightVariant="LGButton"
            widthVariant="FixedWidthButton"
            onClick={form.handleSubmit(onSubmit, onError)}
            disabled={completeDraftLoading}
          />
        </div>
      </div>
    </FormProvider>
  );
}
