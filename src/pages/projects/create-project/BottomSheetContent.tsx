import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { ButtonList, HLine, TomanCounter } from "@/components/common";

import { Button } from "@skul/sanjagh-design-system/src/Design_Button";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import Switch from "@skul/sanjagh-design-system/src/Design_Switch";
import { roomSchema, type RoomFormData } from "./schema";
import { useCreateRoom } from "@/hooks/rooms/useCreateRoom";
import { PaintType, RoomType } from "@/api/services/rooms";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { PAINT_TYPES, ROOM_TYPES } from "./constants";

const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="flex justify-items-start w-full">
      <DesignTitle sizeVariant="SmallSubtitle" text={message} titleVariant="Body" color="RedMain" />
    </div>
  );
};

interface Props {
  closeSheet: () => void;
}

export default function BottomSheetContent({ closeSheet }: Props) {
  const queryClient = useQueryClient();

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(roomSchema),
    defaultValues: {
      roomType: RoomType.LivingRoom,
      length: 4,
      width: 3,
      height: 2.8,
      wallPaintType: PaintType.Plastic,
      wallCoats: 1,
      ceilingEnabled: false,
    },
  });

  const ceilingEnabled = watch("ceilingEnabled");

  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") as string;

  const { mutate: createRoom } = useCreateRoom({
    projectId,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.project(projectId),
      });
      reset();
      closeSheet();
    },
  });

  const onSubmit: SubmitHandler<RoomFormData> = data => {
    createRoom({
      type: data.roomType,
      width: data.width,
      length: data.length,
      height: data.height,
      wall_paint_type: data.wallPaintType,
      wall_coats: data.wallCoats,
      ceiling_enabled: data.ceilingEnabled,
      ceiling_paint_type: data.ceilingPaintType,
      ceiling_coats: data.ceilingCoats,
    });
  };

  return (
    <div className="mb-20">
      <div className="flex justify-center">
        <DesignTitle sizeVariant="FirstTitle" text="افزودن اتاق" titleVariant="Body" />
      </div>

      {/* Room Type */}
      <Controller
        name="roomType"
        control={control}
        render={({ field }) => (
          <ButtonList
            list={ROOM_TYPES}
            value={field.value}
            onChange={field.onChange}
            className="grid grid-cols-2 gap-x-3 gap-y-4 mt-4"
          />
        )}
      />

      <HLine />

      <div className="flex flex-col gap-3">
        {/* Length */}
        <div className="flex justify-between items-center gap-2">
          <DesignTitle sizeVariant="Body" text="طول(متر)" titleVariant="Body" />

          <div className="flex flex-col items-end">
            <Controller
              name="length"
              control={control}
              render={({ field }) => (
                <TomanCounter
                  hasError={!!errors.length}
                  initialCounterValue={String(field.value)}
                  step={0.1}
                  onCounterChange={value => field.onChange(Number(value.value))}
                  max={25}
                  min={1}
                />
              )}
            />
            <ErrorMessage message={errors.length?.message} />
          </div>
        </div>

        {/* Width */}
        <div className="flex justify-between items-center gap-2">
          <DesignTitle sizeVariant="Body" text="عرض(متر)" titleVariant="Body" />

          <div className="flex flex-col items-end">
            <Controller
              name="width"
              control={control}
              render={({ field }) => (
                <TomanCounter
                  hasError={!!errors.width}
                  initialCounterValue={String(field.value)}
                  step={0.1}
                  min={1}
                  max={25}
                  onCounterChange={value => field.onChange(Number(value.value))}
                />
              )}
            />
            <ErrorMessage message={errors.width?.message} />
          </div>
        </div>

        {/* Height */}
        <div className="flex justify-between items-center gap-2">
          <DesignTitle sizeVariant="Body" text="ارتفاع(متر)" titleVariant="Body" />

          <div className="flex flex-col items-end">
            <Controller
              name="height"
              control={control}
              render={({ field }) => (
                <TomanCounter
                  hasError={!!errors.height}
                  initialCounterValue={String(field.value)}
                  step={0.1}
                  min={2}
                  max={10}
                  onCounterChange={value => field.onChange(Number(value.value))}
                />
              )}
            />
            <ErrorMessage message={errors.height?.message} />
          </div>
        </div>
      </div>

      <HLine />

      {/* Wall Paint Type */}
      <DesignTitle sizeVariant="FirstTitle" text="رنگ دیوار" titleVariant="Body" />

      <Controller
        name="wallPaintType"
        control={control}
        render={({ field }) => (
          <>
            <ButtonList
              list={PAINT_TYPES}
              value={field.value}
              onChange={field.onChange}
              className="grid grid-cols-3 gap-x-4 mt-1"
            />
            <ErrorMessage message={errors.wallPaintType?.message} />
          </>
        )}
      />

      {/* Wall Coat Count */}
      <div className="flex justify-between gap-2 items-center mt-6">
        <div className="flex flex-col items-start w-1/2">
          <Controller
            name="wallCoats"
            control={control}
            render={({ field }) => (
              <TomanCounter
                hasError={!!errors.wallCoats}
                initialCounterValue={String(field.value)}
                step={1}
                max={4}
                onCounterChange={value => field.onChange(Number(value.value))}
              />
            )}
          />
          <ErrorMessage message={errors.wallCoats?.message} />
        </div>

        <DesignTitle sizeVariant="FirstTitle" text="تعداد دست دیوار" titleVariant="Body" />
      </div>

      <HLine />

      {/* Roof Color Switch */}
      <div className="border-2 border-design-gray-200 rounded-lg flex justify-between px-4 py-3">
        <DesignTitle sizeVariant="SecondTitle" text="رنگ سقف" titleVariant="Body" />

        <Controller
          name="ceilingEnabled"
          control={control}
          render={({ field }) => <Switch label=" " size="LG" checked={field.value} onCheckedChange={field.onChange} />}
        />
      </div>
      <ErrorMessage message={errors.ceilingEnabled?.message} />

      {ceilingEnabled && (
        <>
          {/* Roof Paint Type */}
          <Controller
            name="ceilingPaintType"
            control={control}
            render={({ field }) => (
              <>
                <ButtonList
                  list={PAINT_TYPES}
                  value={field.value}
                  onChange={field.onChange}
                  className="grid grid-cols-2 gap-x-3 gap-y-4 mt-4"
                />
                <ErrorMessage message={errors.ceilingPaintType?.message} />
              </>
            )}
          />

          {/* Roof Coat Count */}
          <div className="flex justify-between gap-2 items-center mt-6">
            <div className="flex flex-col items-start w-1/2">
              <Controller
                name="ceilingCoats"
                control={control}
                render={({ field }) => (
                  <TomanCounter
                    hasError={!!errors.ceilingCoats}
                    initialCounterValue={String(field.value)}
                    step={1}
                    onCounterChange={value => field.onChange(Number(value.value))}
                    max={4}
                  />
                )}
              />
              <ErrorMessage message={errors.ceilingCoats?.message} />
            </div>

            <DesignTitle sizeVariant="FirstTitle" text="تعداد دست سقف" titleVariant="Body" />
          </div>
        </>
      )}

      <div className="mt-6">
        <DesignTitle
          sizeVariant="Body"
          titleVariant="Body"
          color="Gray600"
          text="اطلاعات وارد شده برای محاسبه دقیق مساحت رنگ‌آمیزی و برآورد هزینه استفاده می‌شود."
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-4 py-2 bg-white border border-white z-10">
        <Button
          buttonVariant="PrimarySolidButton"
          contentVariant={{
            TAG: "Text",
            value: "ذخیره اتاق",
          }}
          heightVariant="LGButton"
          widthVariant="FixedWidthButton"
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
}
