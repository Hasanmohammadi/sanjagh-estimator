import { Link, useLocation } from "react-router-dom";
import { ReceiptIcon, SettingsIcon } from "@/assets/icons";

export default function NavBar() {
  const location = useLocation();

  const isSettings = location.pathname.startsWith("/settings");

  return (
    <div className="bg-design-white pt-3 pb-2 fixed flex justify-around items-center bottom-0 w-full left-0 rounded-t-3xl shadow-designLow shadow-design-gray-300">
      <Link to="/projects" className="items-center gap-1 flex flex-col">
        <ReceiptIcon active={!isSettings} />
        پروژه ها
      </Link>

      <Link to="/settings" className="items-center gap-1 flex flex-col">
        <SettingsIcon active={isSettings} />
        تنظیمات
      </Link>
    </div>
  );
}
