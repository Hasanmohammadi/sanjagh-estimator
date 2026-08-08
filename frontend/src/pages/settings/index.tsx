import { MenuStarIcon, ProLogo, SettingsIcon, VideoIcon } from "@/assets/icons";
import { BottomSheet, HLine } from "@/components/common";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { useState } from "react";
import { Link } from "react-router-dom";

type MenuItem = {
  icon: React.ReactNode;
  text: string;
  extra?: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

const BASE_MENU_ITEMS: Omit<MenuItem, "onClick">[] = [
  {
    icon: <MenuStarIcon />,
    text: "انتخاب گرافیک",
    extra: <ProLogo />,
    href: "theme-selector",
  },
  {
    icon: <SettingsIcon />,
    text: "تنظیم قیمت پایه",
    href: "price-config",
  },
];

export default function Settings() {
  const [open, setOpen] = useState(false);

  const menuItems: MenuItem[] = [
    ...BASE_MENU_ITEMS,
    {
      icon: <VideoIcon />,
      text: "معرفی برآورد ساز",
      onClick: () => setOpen(true),
    },
  ];
  return (
    <div>
      {menuItems.map(({ icon, text, extra, href, onClick }) => (
        <div key={text}>
          {href ? (
            <Link to={href} className="flex items-center gap-3">
              {icon}
              <DesignTitle sizeVariant="Body" titleVariant="Body" text={text} />
              {extra}
            </Link>
          ) : (
            <button type="button" onClick={onClick} className="flex w-full items-center gap-3 text-right">
              {icon}
              <DesignTitle sizeVariant="Body" titleVariant="Body" text={text} />
              {extra}
            </button>
          )}

          <HLine fullWidth />
        </div>
      ))}

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-4">
          <DesignTitle text="معرفی برآورد ساز" sizeVariant="Subtitle" titleVariant="SecondHeader" />
          <DesignTitle
            text="نمایی شیک و کاربردی از ویژگی‌های برآورد ساز. نمایی شیک و کاربردی از ویژگی‌های برآورد ساز. نمایی شیک و کاربردی از ویژگی‌های برآورد ساز."
            sizeVariant="Body"
            titleVariant="Body"
            color="Gray600"
          />
        </div>
      </BottomSheet>
    </div>
  );
}
