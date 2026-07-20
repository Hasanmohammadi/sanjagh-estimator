import { Link } from "react-router-dom";
import { ComingSoon, ReceiptIcon, SettingsIcon } from "@/assets/icons";

export default function NavBar() {
  return (
    <div className="bg-design-white pt-3 pb-2 fixed flex justify-around items-center bottom-0 w-full left-0 rounded-t-3xl shadow-designLow shadow-design-gray-300">
      <Link to="/projects" className="items-center gap-1 flex flex-col">
        <ReceiptIcon />
        پروژه ها
      </Link>

      <div className="relative">
        <div className="absolute -right-2 top-3">
          <ComingSoon />
        </div>
        <div className="items-center gap-1 flex flex-col opacity-40">
          <SettingsIcon />
          تنظیمات
        </div>
      </div>
    </div>
  );
}
