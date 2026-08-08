import {
  CalendarIcon,
  ColorPriceIcon,
  DropletIcon,
  HorizontalFrame,
  ThreeLineIcon,
  UserIcon,
  WalletIcon,
} from "@/assets/icons";
import { VLine } from "@/components/common";
import type { EstimateFormValues } from "@/pages/estimation-results/schema";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import React from "react";

import blueColorBrush from "@/assets/pic/theme/light/blueColorBrush.png";
import orangeColorBrushWithBrush from "@/assets/pic/theme/light/orangeColorBrushWithBrush.png";
import paintBucket from "@/assets/pic/theme/light/paintBucket.png";

interface StatItemProps {
  icon: React.ReactNode;
  value: string | number;
  sub?: string;
  subSub?: string;
  label: string;
  color?: "red" | "blue";
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, sub = "", label, color, subSub }) => (
  <div className="flex flex-1 flex-col items-center justify-between text-center">
    <DesignTitle sizeVariant="SmallSubtitle" text={label} titleVariant="Caption" />
    <div className="mt-1 mb-1">{icon}</div>
    <div>
      <DesignTitle
        sizeVariant="Subtitle"
        text={`${value}`}
        titleVariant="FristHeader"
        color={color === "red" ? "RedMain" : "BlueMain"}
      />
      <DesignTitle
        sizeVariant="Subtitle"
        text={`${sub}`}
        titleVariant="FristHeader"
        color={color === "red" ? "RedMain" : "BlueMain"}
      />
      {subSub && (
        <DesignTitle
          sizeVariant="Caption"
          text={`${subSub}`}
          titleVariant="Caption"
          color={color === "red" ? "RedMain" : "BlueMain"}
        />
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
    className={`flex items-center justify-between border-b border-slate-100 py-2.5 last:border-b-0 last:pb-0 ${
      bold ? "font-bold" : "font-medium"
    }`}
  >
    <div className="w-1/2 text-right">
      <DesignTitle sizeVariant="Body" text={color} titleVariant="Body" color={bold ? "BlueMain" : "BlackMain"} />
    </div>
    <div className="w-1/4 text-center">
      <DesignTitle
        sizeVariant="Subtitle"
        text={liter.toLocaleString()}
        titleVariant="Body"
        color={bold ? "BlueMain" : "BlackMain"}
      />
    </div>
    <div className="w-1/4 text-left pl-3">
      <DesignTitle
        sizeVariant="Subtitle"
        text={price.toLocaleString()}
        titleVariant="Body"
        color={bold ? "BlueMain" : "BlackMain"}
      />
    </div>
  </div>
);

interface Props {
  data: EstimateFormValues;
}

export default function LightTheme({ data }: Props) {
  return (
    <>
      <img src={blueColorBrush} className="absolute top-0 right-0 h-30" />
      <img src={orangeColorBrushWithBrush} className="absolute top-0 left-0 h-30 w-23" />
      <div className="w-full flex justify-center">
        <HorizontalFrame />
      </div>
      <div className="mt-6.5 rounded-lg border border-design-gray-200 px-1.5 flex py-0.5  ">
        <div className="flex items-center">
          <div className="flex justify-start items-center gap-0.5">
            <UserIcon />
            <div>
              <DesignTitle color="BlackMain" sizeVariant="Body" text="توسط:" titleVariant="Body" />
              <DesignTitle color="BlackMain" sizeVariant="Body" text={data.customerName} titleVariant="Body" />
            </div>
          </div>
          <div className="flex justify-center px-4">
            <VLine />
          </div>
          <div>
            <DesignTitle color="BlackMain" sizeVariant="Body" text="متخصص" titleVariant="Body" />
            <DesignTitle color="BlackMain" sizeVariant="Body" text="نقاشی ساختمان" titleVariant="Body" />
          </div>
        </div>
        <div className="flex justify-center px-4">
          <VLine />
        </div>

        <div>
          <DesignTitle color="BlackMain" sizeVariant="Body" text="مشتری:" titleVariant="Body" />
          <DesignTitle color="BlackMain" sizeVariant="Body" text={`${data.customerName}`} titleVariant="Body" />
        </div>
      </div>
      {/* Stats card */}
      <div className="flex items-center gap-2 mt-6">
        <div className="rounded-lg py-2 border border-design-gray-200 w-full h-40">
          <StatItem
            icon={
              <div className="rounded-full bg-blue-50 p-1.5">
                <WalletIcon color="#3f93f3" />
              </div>
            }
            value={data.totalCost.toLocaleString()}
            label="هزینه نهایی"
            subSub="(مصالح و اجرت)"
            sub="تومان"
            color="blue"
          />
        </div>
        <div className="rounded-lg py-2 border border-design-gray-200 w-full h-40">
          <StatItem
            color="red"
            icon={
              <div className="rounded-full bg-red-100 p-2">
                <DropletIcon />
              </div>
            }
            value={data.meterage}
            sub="(متر مربع)"
            label="متر رنگ آمیزی"
          />
        </div>
        <div className="rounded-lg py-2 border border-design-gray-200 w-full h-40">
          <StatItem
            color="blue"
            icon={
              <div className="rounded-full bg-blue-50 p-2">
                <CalendarIcon color="#3f93f3" />
              </div>
            }
            value={data.days}
            sub="(روز)"
            label="زمان اجرا"
          />
        </div>
        <div className="rounded-lg py-2 border border-design-gray-200 w-full h-40">
          <StatItem
            color="red"
            icon={
              <div className="rounded-full bg-red-100 p-2">
                <ColorPriceIcon />
              </div>
            }
            value={data.paints.acrylic.liters + data.paints.oil.liters + data.paints.plastic.liters}
            sub="(لیتر)"
            label="رنگ مورد نیاز"
          />
        </div>
      </div>
      {/* Materials table */}
      <div className="relative my-4 pb-4 pt-9 rounded-lg border border-design-gray-200 ">
        <div className="border-b border-b-design-blue-2 px-6">
          <div className="bg-design-blue-1 flex justify-between items-center px-4 rounded-lg py-1 w-40 absolute -top-2 left-0 right-0 m-auto">
            <ThreeLineIcon />
            <DesignTitle sizeVariant="SmallSubtitle" text="جزییات مصالح و لوازم" titleVariant="Body" color="Gray100" />
            <div className="rotate-180">
              <ThreeLineIcon />
            </div>
          </div>
          <div className="flex items-center justify-between pb-2">
            <div className="w-1/3 text-right">
              <DesignTitle sizeVariant="Subtitle" text="رنگ" titleVariant="Body" color="BlueMain" />
            </div>
            <div className="w-1/4 text-left">
              <DesignTitle sizeVariant="Subtitle" text="لیتر" titleVariant="Body" color="BlueMain" />
            </div>
            <div className="w-1/4 text-left">
              <DesignTitle sizeVariant="Subtitle" text="قیمت(تومان)" titleVariant="Body" color="BlueMain" />
            </div>
          </div>
        </div>
        <div className="px-6">
          <TableRow color="رنگ پلاستیک" price={data.paints.plastic.total_cost} liter={data.paints.plastic.liters} />
          <TableRow color="رنگ روغنی" price={data.paints.oil.liters} liter={data.paints.oil.liters} />
          <TableRow color="رنگ آکریلیک" price={data.paints.acrylic.liters} liter={data.paints.acrylic.liters} />
          <TableRow color="سایر ملزومات و ابزار" price={data.totalMaterialCost} liter="-" />
        </div>
        <div className="px-6 border-t border-design-blue-2 mt-2">
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
      </div>
      {/* Other notes */}
      <div className="relative mt-12">
        <div className="bg-design-blue-1 rounded-lg flex justify-between items-center p-1 px-2.5 w-36 absolute -top-6 left-0 right-0 m-auto">
          <ThreeLineIcon />
          <DesignTitle sizeVariant="SmallSubtitle" text="سایر توضیحات" titleVariant="Body" color="Gray100" />
          <div className="rotate-180">
            <ThreeLineIcon />
          </div>
        </div>
        <div className="rounded-lg bg-[#FEF5ED] px-3 py-3">
          <img src={paintBucket} className="float-left -mt-3.5 -ml-3" />

          <DesignTitle sizeVariant="Body" text={data.notes} titleVariant="Body" />
        </div>
      </div>
    </>
  );
}
