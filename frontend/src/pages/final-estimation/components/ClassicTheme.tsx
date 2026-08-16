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
import { Button } from "@skul/sanjagh-design-system/src/Design_Button";
import React, { useRef } from "react";
import { useShareImage } from "@/hooks/useShareImage";

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
    className={`flex items-center justify-between border-b border-slate-100 py-3 text-[13px] last:border-b-0 last:pb-0 ${
      bold ? "font-bold text-slate-800" : "font-medium text-slate-600"
    }`}
  >
    <div className="w-1/2 text-right">
      <DesignTitle sizeVariant="Body" text={color} titleVariant="Body" />
    </div>

    <div className="w-1/4 text-center">
      <DesignTitle sizeVariant="Subtitle" text={liter.toLocaleString()} titleVariant="Body" />
    </div>

    <div className="w-1/4 pl-3 text-left">
      <DesignTitle sizeVariant="Subtitle" text={price.toLocaleString()} titleVariant="Body" />
    </div>
  </div>
);

interface Props {
  data: EstimateFormValues;
}

export default function ClassicTheme({ data }: Props) {
  const shareRef = useRef<HTMLDivElement>(null);

  const { shareImage, isSharing } = useShareImage({
    fileName: "برآورد-رنگ-آمیزی.png",
    title: "برآورد رنگ آمیزی",
    text: "برآورد هزینه رنگ آمیزی",
  });

  const totalPaintLiters = data.paints.acrylic.liters + data.paints.oil.liters + data.paints.plastic.liters;

  return (
    <div>
      {/* =========================
          SHAREABLE CONTENT
      ========================== */}

      <div ref={shareRef} className="bg-white" dir="rtl">
        {/* Top frame */}
        <div className="mt-4 flex w-full justify-center">
          <HorizontalFrame />
        </div>

        {/* Customer / Specialist */}
        <div className="mt-4 rounded-lg border border-design-gray-200 bg-gray-50 px-1.5 py-2">
          <div className="flex items-center justify-between border-b border-design-gray-200 pb-3">
            <div className="flex justify-start whitespace-nowrap">
              <DesignTitle
                color="BlackMain"
                sizeVariant="Body"
                text={`توسط ${data.customerName}:`}
                titleVariant="Body"
              />
            </div>

            <div className="flex items-center justify-end gap-2 whitespace-nowrap">
              <DesignTitle color="BlackMain" sizeVariant="Body" text="متخصص نقاشی ساختمان" titleVariant="Body" />

              <VerificationIcon />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3">
            <div className="flex justify-start whitespace-nowrap">
              <DesignTitle color="BlackMain" sizeVariant="Body" text="مشتری:" titleVariant="Body" />
            </div>

            <div className="flex items-center justify-end gap-2 whitespace-nowrap">
              <DesignTitle color="BlackMain" sizeVariant="Body" text={`${data.customerName}`} titleVariant="Body" />

              <CallIcon />
            </div>
          </div>
        </div>

        {/* Stats top frame */}
        <div className="mt-4 flex w-full justify-center">
          <HorizontalFrame />
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-2">
          {/* Final Cost */}
          <div className="h-40 w-full rounded-lg border border-design-gray-200 bg-design-gray-50 py-2">
            <StatItem
              icon={<WalletIcon />}
              value={data.totalCost.toLocaleString()}
              label="هزینه نهایی"
              subSub="(مصالح و اجرت)"
              sub="تومان"
            />
          </div>

          {/* Days */}
          <div className="h-40 w-full rounded-lg border border-design-gray-200 py-2">
            <StatItem icon={<CalendarIcon />} value={data.days} sub="(روز)" label="زمان اجرا" />
          </div>

          {/* Meterage */}
          <div className="h-40 w-full rounded-lg border border-design-gray-200 py-2">
            <StatItem icon={<DropletIcon />} value={data.meterage} sub="(متر مربع)" label="متر رنگ آمیزی" />
          </div>

          {/* Paint */}
          <div className="h-40 w-full rounded-lg border border-design-gray-200 py-2">
            <StatItem icon={<ColorPriceIcon />} value={totalPaintLiters} sub="(لیتر)" label="رنگ مورد نیاز" />
          </div>
        </div>

        {/* Materials bottom frame */}
        <div className="mt-4 flex w-full justify-center">
          <HorizontalFrame />
        </div>

        {/* Materials */}
        <div className="my-4 rounded-lg border border-design-gray-200 px-6 py-4">
          <div className="flex items-center justify-center">
            <DesignTitle sizeVariant="ThirdTitle" text="جزییات مصالح و قیمت ها" titleVariant="ThirdHeader" />
          </div>

          <div className="mt-4 flex items-center justify-between pb-2">
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

        {/* Other notes frame */}
        <div className="mt-4 flex w-full justify-center">
          <HorizontalFrame />
        </div>

        {/* Other notes title */}
        <div className="mt-2 flex w-full justify-center">
          <DesignTitle sizeVariant="ThirdTitle" text="سایر توضیحات" titleVariant="Body" color="NewGreenMain" />
        </div>

        {/* Notes */}
        <TextArea
          backgroundVariant="Outlined"
          heightVariant="LGTextField"
          inputTypeVariant="Normal"
          onTextChanged={() => {}}
          value={data.notes ?? ""}
          disabled
          className="mt-2 rounded-lg"
        />
      </div>

      {/* =========================
          SHARE BUTTON
      ========================== */}

      <div className="mt-4 flex w-full justify-center">
        <div className="my-4 w-11/12">
          <Button
            buttonVariant="PrimarySolidButton"
            contentVariant={{
              value: isSharing ? "در حال آماده‌سازی..." : "اشتراک گذاری",
              TAG: "Text",
            }}
            heightVariant="MDButton"
            widthVariant="AutoWidthButton"
            extraClassName="w-full"
            onClick={() => shareImage(shareRef.current)}
            disabled={isSharing}
          />
        </div>
      </div>
    </div>
  );
}
