import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@/assets/icons";

type AccordionProps = {
  title: string;
  date?: string;
  children: React.ReactNode;
};

export default function Accordion({ title, date, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="shadow-design-gray-200 shadow-designLow rounded-lg overflow-hidden mb-3 bg-white">
      <button onClick={() => setIsOpen(p => !p)} className="w-full flex items-center justify-between px-4 pt-1">
        <DesignTitle sizeVariant="Subtitle" text={title} titleVariant="Body" color="BlackMain" />

        <div className="flex items-center">
          {!isOpen && date && <DesignTitle sizeVariant="Body" text={date} titleVariant="Caption" color="Gray600" />}
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </div>
      </button>

      {isOpen && <div className="px-4 pb-3 pt-1 text-sm text-gray-700">{children}</div>}
    </div>
  );
}
