import { SettingsIcon } from "@/assets/icons";
import { Card } from "@skul/sanjagh-design-system/src/Design_Card";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { Link } from "react-router-dom";
interface Props {
  projectId: string;
}

export default function PriceConfig({ projectId }: Props) {
  return (
    <Link to={`/settings/price-config?callback=/estimation-results?projectId=${projectId}`}>
      <Card
        children={
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2.5">
              <DesignTitle
                sizeVariant="ThirdTitle"
                text="تنظیم قیمت پایه"
                titleVariant="ThirdHeader"
                color="BlueMain"
              />
              <DesignTitle sizeVariant="Body" text="شامل قیمت رنگ و موارد مصرفی" titleVariant="Body" color="Gray600" />
            </div>
            <SettingsIcon />
          </div>
        }
        extraClassName="border-2 border-design-gray-200"
        shadow="NoShadow"
        variant="SM"
      />
    </Link>
  );
}
