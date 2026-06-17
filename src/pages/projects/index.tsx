import { Button } from "@skul/sanjagh-design-system/src/Design_Button.tsx";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";

export default function Projects() {
  const projects = [];

  return (
    <div className="flex flex-col">
      <Button
        buttonVariant="PrimarySolidButton"
        contentVariant={{ TAG: "Text", value: "ایجاد پروژه ی جدید" }}
        heightVariant="MDButton"
        widthVariant="FixedWidthButton"
      />

      {projects.length ? (
        <></>
      ) : (
        <div className="flex flex-col gap-4 h-full items-center mt-20">
          <DesignTitle
            sizeVariant="SecondTitle"
            text="هیچ پروژه‌ای وجود ندارد!"
            titleVariant="SecondHeader"
            color="Gray500"
          />

          <DesignTitle
            sizeVariant="Subtitle"
            text="برای شروع، یک پروژه جدید بسازید"
            titleVariant="Body"
            color="Gray400"
          />
        </div>
      )}
    </div>
  );
}
