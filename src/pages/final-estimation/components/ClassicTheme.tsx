import {
  CalendarIcon,
  CallIcon,
  ColorPriceIcon,
  DropletIcon,
  HorizontalFrame,
  VerificationIcon,
  WalletIcon,
} from "@/assets/icons";
import type { EstimateFormValues } from "@/pages/estimation-results/schema";
import TextArea from "@skul/sanjagh-design-system/src/Design_TextArea";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import React from "react";

interface StatItemProps {
  icon: React.ReactNode;
  value: string | number;
  sub?: string;
  label: string;
  subSub?: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, sub = "", label, subSub }) => (
  <div className="flex flex-1 flex-col items-center justify-between text-center">
    <DesignTitle sizeVariant="SmallSubtitle" text={label} titleVariant="Caption" />
    <div className="mt-1 mb-1">{icon}</div>
    <div className="mt-3.5">
      <DesignTitle sizeVariant="Subtitle" text={`${value}`} titleVariant="FristHeader" />
      <DesignTitle sizeVariant="Subtitle" text={`${sub}`} titleVariant="FristHeader" />
      {subSub && (
        <div className="-mt-2">
          <DesignTitle sizeVariant="Caption" text={`${subSub}`} titleVariant="Caption" />
        </div>
      )}
    </div>
  </div>
);

interface TableRowProps {
  color: string;
  price: number;
  liter: number | string;
  bold?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({ color, price, liter, bold }) => (
  <div
    className={`flex items-center border-b justify-between border-slate-100 py-3 text-[13px] last:border-b-0 last:pb-0 ${
      bold ? "font-bold text-slate-800" : "font-medium text-slate-600"
    }`}
  >
    <div className="w-1/2 text-right">
      <DesignTitle sizeVariant="Body" text={color} titleVariant="Body" />
    </div>
    <div className="w-1/4 text-center">
      <DesignTitle sizeVariant="Subtitle" text={liter.toLocaleString()} titleVariant="Body" />
    </div>
    <div className="w-1/4 text-left pl-3">
      <DesignTitle sizeVariant="Subtitle" text={price.toLocaleString()} titleVariant="Body" />
    </div>
  </div>
);

interface Props {
  data: EstimateFormValues;
}

export default function ClassicTheme({ data }: Props) {
  return (
    <>
      <div className="w-full flex justify-center mt-4">
        <HorizontalFrame />
      </div>

      <div className="mt-4 bg-gray-50 rounded-lg border border-design-gray-200 px-1.5 py-2">
        <div className="flex justify-between items-center pb-3 border-b border-design-gray-200">
          <div className="flex justify-start whitespace-nowrap">
            <DesignTitle color="BlackMain" sizeVariant="Body" text={`توسط ${data.customerName}:`} titleVariant="Body" />
          </div>
          <div className="flex items-center gap-2 justify-end whitespace-nowrap">
            <DesignTitle color="BlackMain" sizeVariant="Body" text="متخصص نقاشی ساختمان" titleVariant="Body" />
            <VerificationIcon />
          </div>
        </div>

        <div className="flex justify-between items-center pt-3">
          <div className="flex justify-start whitespace-nowrap">
            <DesignTitle color="BlackMain" sizeVariant="Body" text="مشتری:" titleVariant="Body" />
          </div>

          <div className="flex items-center gap-2 justify-end whitespace-nowrap">
            <DesignTitle color="BlackMain" sizeVariant="Body" text={`${data.customerName}`} titleVariant="Body" />
            <CallIcon />
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center mt-4">
        <HorizontalFrame />
      </div>
      {/* Stats card */}
      <div className="flex items-center gap-2 mt-4">
        <div className="rounded-lg py-2 border border-design-gray-200 w-full h-40 bg-design-gray-50">
          <StatItem
            icon={<WalletIcon />}
            value={data.totalCost.toLocaleString()}
            label="هزینه نهایی"
            subSub="(مصالح و اجرت)"
            sub="تومان"
          />
        </div>
        <div className="rounded-lg py-2 border border-design-gray-200 w-full h-40">
          <StatItem icon={<CalendarIcon />} value={data.days} sub="(روز)" label="زمان اجرا" />
        </div>
        <div className="rounded-lg py-2 border border-design-gray-200 w-full h-40">
          <StatItem icon={<DropletIcon />} value={data.meterage} sub="(متر مربع)" label="متر رنگ آمیزی" />
        </div>
        <div className="rounded-lg py-2 border border-design-gray-200 w-full h-40">
          <StatItem
            icon={<ColorPriceIcon />}
            value={data.paints.acrylic.liters + data.paints.oil.liters + data.paints.plastic.liters}
            sub="(لیتر)"
            label="رنگ مورد نیاز"
          />
        </div>
      </div>
      <div className="w-full flex justify-center mt-4">
        <HorizontalFrame />
      </div>
      {/* Materials table */}
      <div className="my-4 px-6 py-4 rounded-lg border border-design-gray-200">
        <div className="flex justify-center items-center">
          <DesignTitle sizeVariant="ThirdTitle" text="جزییات مصالح و قیمت ها" titleVariant="ThirdHeader" />
        </div>

        <div className="flex items-center justify-between pb-2 mt-4">
          <div className="w-1/3 text-right">
            <DesignTitle sizeVariant="Subtitle" text="رنگ" titleVariant="Body" color="NewGreenMain" />
          </div>
          <div className="w-1/4 text-left">
            <DesignTitle sizeVariant="Subtitle" text="لیتر" titleVariant="Body" color="NewGreenMain" />
          </div>
          <div className="w-1/4 text-left">
            <DesignTitle sizeVariant="Subtitle" text="قیمت(تومان)" titleVariant="Body" color="NewGreenMain" />
          </div>
        </div>
        <TableRow color="رنگ پلاستیک" price={data.paints.plastic.total_cost} liter={data.paints.plastic.liters} />
        <TableRow color="رنگ روغنی" price={data.paints.oil.liters} liter={data.paints.oil.liters} />
        <TableRow color="رنگ آکریلیک" price={data.paints.acrylic.liters} liter={data.paints.acrylic.liters} />
        <TableRow color="سایر ملزومات و ابزار" price={data.totalMaterialCost} liter="-" />
        <TableRow
          color="جمع کل"
          price={
            data.paints.plastic.total_cost +
            data.paints.oil.liters +
            data.paints.acrylic.liters +
            data.totalMaterialCost
          }
          liter="-"
          bold
        />
      </div>

      {/* Other notes */}
      <div className="w-full flex justify-center mt-4">
        <HorizontalFrame />
      </div>
      <div className="w-full flex justify-center mt-2">
        <DesignTitle sizeVariant="ThirdTitle" text="سایر توضیحات" titleVariant="Body" color="NewGreenMain" />
      </div>

      <TextArea
        backgroundVariant="Outlined"
        heightVariant="LGTextField"
        inputTypeVariant="Normal"
        onTextChanged={() => {}}
        value={data.notes}
        disabled
        className="rounded-lg mt-2"
      />
    </>
  );
}
