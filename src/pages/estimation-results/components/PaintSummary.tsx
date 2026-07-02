import { SettingsIcon } from "@/assets/icons";
import { HLine, TomanCounter } from "@/components/common";
import { Card } from "@skul/sanjagh-design-system/src/Design_Card";
import Switch from "@skul/sanjagh-design-system/src/Design_Switch";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { Link } from "react-router-dom";

export default function PaintSummary() {
  return (
    <Card
      children={
        <>
          <div className="flex justify-between items-center mb-1">
            <DesignTitle sizeVariant="ThirdTitle" text="نمایش جزییات رنگ ها" titleVariant="Body" color="BlackMain" />
            <Switch className="text-design-blue-1" label="نمایش" size="LG" checked={false} onCheckedChange={() => {}} />
          </div>
          <DesignTitle
            sizeVariant="Body"
            text="مشاهده تمام رنگ های استفاده شده در پروژه"
            titleVariant="Body"
            color="Gray500"
          />
          <Card
            children={
              <>
                <div className="flex justify-between items-center mb-1">
                  <DesignTitle
                    sizeVariant="ThirdTitle"
                    text="جزییات مصالح و لوازم"
                    titleVariant="Body"
                    color="BlackMain"
                  />
                  <Link to="price-config" className="flex gap-2">
                    <DesignTitle sizeVariant="Subtitle" text="قیمت رنگ من" titleVariant="Body" color="BlueMain" />
                    <SettingsIcon color="#3F93F3" />
                  </Link>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="w-1/3">
                    <DesignTitle sizeVariant="Subtitle" text="رنگ" titleVariant="Body" color="NewGreenMain" />
                  </div>
                  <div className="w-1/3 text-center">
                    <DesignTitle sizeVariant="Subtitle" text="لیتر" titleVariant="Body" color="NewGreenMain" />
                  </div>
                  <div className="w-1/3 text-end">
                    <DesignTitle sizeVariant="Subtitle" text="قیمت(تومان)" titleVariant="Body" color="NewGreenMain" />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="w-1/3">
                    <DesignTitle sizeVariant="Body" text="رنگ  پلاستیک" titleVariant="Body" color="BlackMain" />
                  </div>
                  <div className="w-1/3 text-center">
                    <TomanCounter
                      hasError={false}
                      initialCounterValue="1"
                      onCounterChange={() => {}}
                      step={1}
                      min={1}
                    />
                  </div>
                  <div className="w-1/3 text-end">
                    <DesignTitle sizeVariant="ThirdTitle" text="۴٬۱۰۰,۰۰۰" titleVariant="Body" color="BlackMain" />
                  </div>
                </div>
                <HLine />
                <div className="flex justify-between items-center">
                  <div className="w-1/3">
                    <DesignTitle sizeVariant="Body" text="رنگ روغن" titleVariant="Body" color="BlackMain" />
                  </div>
                  <div className="w-1/3 text-center">
                    <TomanCounter
                      hasError={false}
                      initialCounterValue="1"
                      onCounterChange={() => {}}
                      step={1}
                      min={1}
                    />
                  </div>
                  <div className="w-1/3 text-end">
                    <DesignTitle sizeVariant="ThirdTitle" text="۴٬۱۰۰,۰۰۰" titleVariant="Body" color="BlackMain" />
                  </div>
                </div>
                <HLine />
                <div className="flex justify-between items-center">
                  <div className="w-1/3">
                    <DesignTitle sizeVariant="Body" text="رنگ آکریلیک" titleVariant="Body" color="BlackMain" />
                  </div>
                  <div className="w-1/3 text-center">
                    <TomanCounter
                      hasError={false}
                      initialCounterValue="1"
                      onCounterChange={() => {}}
                      step={1}
                      min={1}
                    />
                  </div>
                  <div className="w-1/3 text-end">
                    <DesignTitle sizeVariant="ThirdTitle" text="۴٬۱۰۰,۰۰۰" titleVariant="Body" color="BlackMain" />
                  </div>
                </div>
                <HLine />
                <div className="flex justify-between items-center">
                  <div className="w-1/3">
                    <DesignTitle sizeVariant="Body" text="سایر ملزومات" titleVariant="Body" color="BlackMain" />
                  </div>
                  <div className="w-2/3 text-center">
                    <TomanCounter
                      hasError={false}
                      initialCounterValue="1"
                      onCounterChange={() => {}}
                      step={1}
                      min={1}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-1.5">
                  <div className="w-1/3">
                    <DesignTitle sizeVariant="ThirdTitle" text="جمع کل" titleVariant="Body" color="BlackMain" />
                  </div>
                  <div className="w-1/3 text-center">-</div>
                  <div className="w-1/3 text-end">
                    <DesignTitle sizeVariant="ThirdTitle" text="۴٬۱۰۰,۰۰۰" titleVariant="Body" color="BlackMain" />
                  </div>
                </div>
              </>
            }
            extraClassName="border-3 border-design-gray-200 mt-2"
            shadow="NoShadow"
            variant="SM"
          />
        </>
      }
      extraClassName="border-2 border-design-gray-200"
      shadow="NoShadow"
      variant="SM"
    />
  );
}
