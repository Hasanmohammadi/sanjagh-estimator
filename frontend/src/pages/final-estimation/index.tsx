import { useEstimate } from "@/hooks/estimates/useEstimate";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spinner } from "@/components/common";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { Button } from "@skul/sanjagh-design-system/src/Design_Button";
import LightTheme from "./components/LightTheme";

export function FinalEstimation() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") as string;
  const { data, isPending } = useEstimate(projectId);

  const navigate = useNavigate();

  if (isPending) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center flex-col items-center gap-6">
        <DesignTitle sizeVariant="FirstTitle" text="اطلاعاتی برای نمایش وجود ندارد!" titleVariant="FristHeader" />
        <Button
          buttonVariant="PrimarySolidButton"
          contentVariant={{ value: "بازگشت", TAG: "Text" }}
          heightVariant="MDButton"
          widthVariant="AutoWidthButton"
          onClick={() => navigate(-1)}
        />
      </div>
    );
  }

  return (
    <>
      <LightTheme data={data} />
      {/* <ClassicTheme data={data} /> */}
    </>
  );
}
