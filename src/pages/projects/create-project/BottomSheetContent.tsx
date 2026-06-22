import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { ButtonList, HLine, TomanCounter } from "@/components/common";

import { Button } from "@skul/sanjagh-design-system/src/Design_Button";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import Switch from "@skul/sanjagh-design-system/src/Design_Switch";
import { roomSchema, type RoomFormData } from "./schema";

export const ROOM_TYPES = [
  { title: "اتاق خواب", value: "bedroom" },
  { title: "پذیرایی", value: "living_room" },
  { title: "سرویس", value: "bathroom" },
  { title: "آشپزخانه", value: "kitchen" },
  { title: "سایر", value: "other" },
  { title: "راهرو", value: "hallway" },
];

export const PAINT_TYPES = [
  { title: "آکریلیک", value: "acrylic" },
  { title: "روغن", value: "oil_based" },
  { title: "پلاستیک", value: "plastic_emulsion" },
];

const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="flex justify-items-start w-full">
      <DesignTitle sizeVariant="SmallSubtitle" text={message} titleVariant="Body" color="RedMain" />
    </div>
  );
};

export default function BottomSheetContent() {
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(roomSchema),
    defaultValues: {
      roomType: "other",
      length: 4,
      width: 3,
      height: 2.8,
      wallPaintType: "acrylic",
      wallCoatCount: 1,
      hasRoofColor: false,
      roofPaintType: "acrylic",
      roofCoatCount: 1,
    },
  });

  const hasRoofColor = watch("hasRoofColor");

  const onSubmit: SubmitHandler<RoomFormData> = data => {
    console.log(data);
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
          <div>
            <ButtonList
              list={ROOM_TYPES}
              defaultValue={field.value}
              onChange={field.onChange}
              className="grid grid-cols-2 gap-x-3 gap-y-4 mt-4"
            />
            <ErrorMessage message={errors.roomType?.message} />
          </div>
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
          <div>
            <ButtonList
              list={PAINT_TYPES}
              defaultValue={field.value}
              onChange={field.onChange}
              className="grid grid-cols-3 gap-x-4 mt-1"
            />
            <ErrorMessage message={errors.wallPaintType?.message} />
          </div>
        )}
      />

      {/* Wall Coat Count */}
      <div className="flex justify-between gap-2 items-center mt-6">
        <div className="flex flex-col items-start w-1/2">
          <Controller
            name="wallCoatCount"
            control={control}
            render={({ field }) => (
              <TomanCounter
                hasError={!!errors.wallCoatCount}
                initialCounterValue={String(field.value)}
                step={1}
                max={4}
                onCounterChange={value => field.onChange(Number(value.value))}
              />
            )}
          />
          <ErrorMessage message={errors.wallCoatCount?.message} />
        </div>

        <DesignTitle sizeVariant="FirstTitle" text="تعداد دست دیوار" titleVariant="Body" />
      </div>

      <HLine />

      {/* Roof Color Switch */}
      <div className="border-2 border-design-gray-200 rounded-lg flex justify-between px-4 py-3">
        <DesignTitle sizeVariant="SecondTitle" text="رنگ سقف" titleVariant="Body" />

        <Controller
          name="hasRoofColor"
          control={control}
          render={({ field }) => <Switch label=" " size="LG" checked={field.value} onCheckedChange={field.onChange} />}
        />
      </div>
      <ErrorMessage message={errors.hasRoofColor?.message} />

      {hasRoofColor && (
        <>
          {/* Roof Paint Type */}
          <Controller
            name="roofPaintType"
            control={control}
            render={({ field }) => (
              <div>
                <ButtonList
                  list={PAINT_TYPES}
                  defaultValue={field.value}
                  onChange={field.onChange}
                  className="grid grid-cols-3 gap-x-4 mt-4"
                />
                <ErrorMessage message={errors.roofPaintType?.message} />
              </div>
            )}
          />

          {/* Roof Coat Count */}
          <div className="flex justify-between gap-2 items-center mt-6">
            <div className="flex flex-col items-start w-1/2">
              <Controller
                name="roofCoatCount"
                control={control}
                render={({ field }) => (
                  <TomanCounter
                    hasError={!!errors.roofCoatCount}
                    initialCounterValue={String(field.value)}
                    step={1}
                    onCounterChange={value => field.onChange(Number(value.value))}
                    max={4}
                  />
                )}
              />
              <ErrorMessage message={errors.roofCoatCount?.message} />
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
