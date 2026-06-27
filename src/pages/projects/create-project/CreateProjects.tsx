import { Button } from "@skul/sanjagh-design-system/src/Design_Button";
import { BottomSheet } from "@/components/common";
import { useState } from "react";
import EmptyState from "./EmptyState";
import BottomSheetContent from "./BottomSheetContent";
import RoomCard from "./RoomCard";
import { useSearchParams } from "react-router-dom";
import { useProject } from "@/hooks/projects/useProject";

export default function CreateProjects() {
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const { data: projectData } = useProject(projectId);

  return (
    <>
      <Button
        buttonVariant="SecondaryGrayButton"
        contentVariant={{ TAG: "Text", value: "افزودن اتاق" }}
        heightVariant="MDButton"
        widthVariant="FixedWidthButton"
        onClick={() => setBottomSheetOpen(true)}
      />
      {projectData?.rooms?.length ? (
        <div className="flex flex-col gap-3 mt-3.5">
          {projectData.rooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      <BottomSheet open={bottomSheetOpen} onClose={() => setBottomSheetOpen(false)}>
        <BottomSheetContent closeSheet={() => setBottomSheetOpen(false)} />
      </BottomSheet>
      {!!projectData?.rooms?.length && (
        <div className="fixed bottom-0 py-2 left-0 right-0 px-4 bg-white z-1 border border-white">
          <Button
            buttonVariant="PrimarySolidButton"
            contentVariant={{ TAG: "Text", value: "مشاهده نتایج" }}
            heightVariant="LGButton"
            widthVariant="FixedWidthButton"
          />
        </div>
      )}
    </>
  );
}
