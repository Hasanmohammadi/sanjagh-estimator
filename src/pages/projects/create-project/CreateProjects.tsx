import { Button } from "@skul/sanjagh-design-system/src/Design_Button";
import { BottomSheet, ConfirmModal } from "@/components/common";
import { useEffect, useState } from "react";
import EmptyState from "./components/EmptyState";
import BottomSheetContent from "./components/BottomSheetContent";
import RoomCard from "./components/RoomCard";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useProject } from "@/hooks/projects/useProject";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { roomSchema } from "./schema";
import { PaintType, RoomType } from "@/api/services/rooms";
import { usePriceConfig } from "@/hooks/price-config/usePriceConfig";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";

export default function CreateProjects() {
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [roomSelectedId, setRoomSelectedId] = useState<string>();
  const [bottomSheetState, setBottomSheetState] = useState<"edit" | "create">("create");
  const [priceConfigNotice, setPriceConfigNotice] = useState(false);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") as string;
  const { data: projectData } = useProject(projectId);
  const { data: configData } = usePriceConfig();

  const form = useForm({
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

  useEffect(() => {
    if (!bottomSheetOpen) {
      form.reset();
    }
  }, [bottomSheetOpen]);

  return (
    <>
      <Button
        buttonVariant="SecondaryGrayButton"
        contentVariant={{ TAG: "Text", value: "افزودن اتاق" }}
        heightVariant="MDButton"
        widthVariant="FixedWidthButton"
        onClick={() => {
          setBottomSheetState("create");
          setBottomSheetOpen(true);
        }}
      />
      {projectData?.rooms?.length ? (
        <div className="flex flex-col gap-3 mt-3.5">
          {projectData.rooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              onEdit={() => {
                setBottomSheetState("edit");
                setBottomSheetOpen(true);
                form.setValues({
                  ceilingCoats: room.ceiling_coats,
                  ceilingEnabled: room.ceiling_enabled,
                  ceilingPaintType: room.ceiling_paint_type,
                  height: Number(room.height),
                  length: Number(room.length),
                  roomType: room.type,
                  wallCoats: room.wall_coats,
                  wallPaintType: room.wall_paint_type,
                  width: Number(room.width),
                });
                setRoomSelectedId(room.id);
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
      <FormProvider {...form}>
        <BottomSheet open={bottomSheetOpen} onClose={() => setBottomSheetOpen(false)}>
          <BottomSheetContent
            bottomSheetState={bottomSheetState}
            closeSheet={() => setBottomSheetOpen(false)}
            roomSelectedId={roomSelectedId as string}
          />
        </BottomSheet>
      </FormProvider>
      {!!projectData?.rooms?.length && !!configData ? (
        <Link
          to={`/estimation-results?projectId=${projectId}`}
          className="fixed bottom-0 py-2 left-0 right-0 px-4 bg-white z-1 border border-white"
        >
          <Button
            buttonVariant="PrimarySolidButton"
            contentVariant={{ TAG: "Text", value: "مشاهده نتایج" }}
            heightVariant="LGButton"
            widthVariant="FixedWidthButton"
          />
        </Link>
      ) : (
        <div className="fixed bottom-0 py-2 left-0 right-0 px-4 bg-white z-1 border border-white">
          <Button
            buttonVariant="PrimarySolidButton"
            contentVariant={{ TAG: "Text", value: "مشاهده نتایج" }}
            heightVariant="LGButton"
            widthVariant="FixedWidthButton"
            onClick={() => setPriceConfigNotice(true)}
          />
        </div>
      )}
      <ConfirmModal
        open={priceConfigNotice}
        title="جدول قیمت"
        onCancel={() => setPriceConfigNotice(false)}
        onConfirm={() => navigate("/settings/price-config")}
        description={
          <div className="flex flex-col gap-0.5">
            <DesignTitle sizeVariant="Subtitle" text="قیمتی از شما در دسترس نیست!" titleVariant="Caption" />
            <DesignTitle sizeVariant="Subtitle" text="جدول قیمت خود  را پر کنید" titleVariant="Caption" />
          </div>
        }
      />
    </>
  );
}
