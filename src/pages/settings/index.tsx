import { MenuStarIcon, ProLogo, SettingsIcon, VideoIcon } from "@/assets/icons";
import { HLine } from "@/components/common";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { Link } from "react-router-dom";

const menuItem = [
  { icon: <MenuStarIcon />, text: "انتخاب گرافیک", extra: <ProLogo />, href: "estimate-theme" },
  { icon: <SettingsIcon />, text: "تنظیم قیمت پایه", href: "price-config" },
  { icon: <VideoIcon />, text: "معرفی برآورد ساز" },
];

export default function Settings() {
  return (
    <div>
      {menuItem.map(({ icon, text, extra, href }) => (
        <div>
          <Link to={href || "#"} className="flex gap-3 items-center">
            {icon}
            <DesignTitle sizeVariant="Body" text={text} titleVariant="Body" />
            {extra}
          </Link>
          <HLine />
        </div>
      ))}
    </div>
  );
}
