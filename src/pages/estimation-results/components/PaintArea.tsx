import { Card } from "@skul/sanjagh-design-system/src/Design_Card";
import Switch from "@skul/sanjagh-design-system/src/Design_Switch";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";

export default function PaintArea() {
  return (
    <Card
      children={
        <>
          <div className="flex justify-between items-center">
            <div>
              <DesignTitle sizeVariant="ThirdTitle" text="متر رنگ آمیزی" titleVariant="Body" color="BlackMain" />
            </div>
            <Switch className="text-design-blue-1" label="نمایش" size="LG" checked={false} onCheckedChange={() => {}} />
          </div>
          <div className="mt-2 flex justify-end items-center gap-7">
            <span className="text-4xl font-bold">61</span>
            <DesignTitle sizeVariant="ThirdTitle" text="متر مربع" titleVariant="Body" color="BlackMain" />
          </div>
          <DesignTitle sizeVariant="Body" text="برآورد: (۶۰.۸)متر مربع " titleVariant="Body" color="Gray600" />
        </>
      }
      extraClassName="border-2 border-design-gray-200"
      shadow="NoShadow"
      variant="SM"
    />
  );
}
