import { useCalculatePrice } from "@/hooks/estimates/useCalculatePrice";
import CalculationWithMaterial from "./components/CalculationWithMaterial";
import PriceConfig from "./components/PriceConfig";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import Period from "./components/Period";
import PaintArea from "./components/PaintArea";
import PaintSummary from "./components/PaintSummary";
import UserInfo from "./components/UserInfo";
import { useEffect } from "react";
import { estimateSchema, type EstimateFormValues } from "./schema";
import { useCreateEstimate } from "@/hooks/estimates/useCreateEstimate";
import { Button } from "@skul/sanjagh-design-system/src/Design_Button";
import { Spinner } from "@/components/common";

export default function EstimationResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("projectId") as string;

  const { data, isLoading } = useCalculatePrice(projectId);

  const form = useForm<EstimateFormValues>({
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

  useEffect(() => {
    if (data) {
      form.reset({
        totalCost: Math.ceil(data.calculation.final_cost / 1_000_000),
        totalMaterialCost: data.calculation.materials.total_materials_cost,
        accessoriesCost: data.calculation.materials.accessories_cost,
        paints: data.calculation.materials.paints,
        meterage: data.calculation.paint_area,
        days: data.calculation.days,
        visibility: {
          days: true,
          final_cost: true,
          materials: true,
          paint_area: true,
        },
      });
    }
  }, [data, form]);

  const [accessoriesCost, acrylicCost, oilCost, plasticCost] = useWatch({
    control: form.control,
    name: ["accessoriesCost", "paints.acrylic.total_cost", "paints.oil.total_cost", "paints.plastic.total_cost"],
  });

  const BASE_COST = data ? data?.calculation.final_cost - data?.calculation.materials.total_materials_cost : null;

  useEffect(() => {
    const totalMaterials = (accessoriesCost || 0) + (acrylicCost || 0) + (oilCost || 0) + (plasticCost || 0);
    form.setValue("totalMaterialCost", totalMaterials);

    if (BASE_COST) {
      const finalTotal = BASE_COST + totalMaterials;
      form.setValue("totalCost", Math.ceil(finalTotal / 1_000_000));
    }

    form.watch();
  }, [accessoriesCost, acrylicCost, oilCost, plasticCost, form.setValue]);

  const { mutate: createEstimate, isPending: createEstimateLoading } = useCreateEstimate(projectId, {
    onSuccess: () => navigate("/projects"),
  });

  const onSubmit = () => {
    createEstimate({
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
        <PriceConfig projectId={projectId} />
        <CalculationWithMaterial />
        <Period />
        <PaintArea />
        <PaintSummary projectId={projectId} />
        <UserInfo />
        <div className="fixed bottom-0 left-0 right-0 px-4 py-4 shadow-design-black-1 shadow-2xl rounded-t-3xl bg-white border border-white z-10">
          <Button
            buttonVariant="PrimarySolidButton"
            contentVariant={{
              TAG: "Text",
              value: "ذخیره و ارسال برآورد",
            }}
            heightVariant="LGButton"
            widthVariant="FixedWidthButton"
            onClick={form.handleSubmit(onSubmit)}
            disabled={createEstimateLoading}
          />
        </div>
      </div>
    </FormProvider>
  );
}
