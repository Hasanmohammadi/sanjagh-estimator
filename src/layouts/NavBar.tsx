import { Link } from "react-router-dom";
import { ReceiptIcon, SettingsIcon } from "@/assets/icons";

export default function NavBar() {
  return (
    <div className="bg-design-white pt-3 pb-2 fixed flex justify-around items-center bottom-0 w-full left-0 rounded-t-3xl shadow-designLow shadow-design-gray-300">
      <Link to="/projects" className="items-center gap-1 flex flex-col">
        <ReceiptIcon />
        پروژه ها
      </Link>
      <Link to="/settings" className="items-center gap-1 flex flex-col">
        <SettingsIcon />
        تنظیمات
      </Link>
    </div>
  );
}
