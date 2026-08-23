import {
  BackRightIcon,
  CalendarIcon,
  ColorPriceIcon,
  DropletIcon,
  HorizontalFrame,
  PhoneIcon,
  ThreeLineIcon,
  UserIcon,
  WalletIcon,
} from "@/assets/icons";
import type { EstimateFormValues } from "@/pages/estimation-results/schema";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { useRef } from "react";
import { useShareImage } from "@/hooks/useShareImage";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import blueColorBrush from "@/assets/pic/theme/light/blueColorBrush.png";
import orangeColorBrushWithBrush from "@/assets/pic/theme/light/orangeColorBrushWithBrush.webp";
import paintBucket from "@/assets/pic/theme/light/paintBucket.png";
import { Button } from "@skul/sanjagh-design-system/src/Design_Button";
import { useCopyProjectToDraft } from "@/hooks/draft/useCopyProjectToDraft";

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

    <div className="w-1/4 pl-3 text-left">
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
  const shareRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") as string;

  const navigate = useNavigate();

  const { mutate: copyProjectToDraftAction } = useCopyProjectToDraft({
    onSuccess: () => {
      navigate(`/create-projects`);
    },
  });

  const { shareImage, isSharing } = useShareImage({
    fileName: "برآورد-رنگ-آمیزی.png",
    title: "برآورد رنگ آمیزی",
    text: "برآورد هزینه رنگ آمیزی",
  });

  const totalPaintLiters = data.paints.acrylic.liters + data.paints.oil.liters + data.paints.plastic.liters;

  return (
    <div className="absolute top-0 w-full right-0 left-0 pb-32">
      {/* =========================
          SHAREABLE CONTENT
      ========================== */}

      <Link to="/projects" className="absolute right-4 top-10 z-50">
        <BackRightIcon />
      </Link>

      <div ref={shareRef} className="relative w-full bg-white " dir="rtl">
        {/* Header */}
        <div className="relative h-32 overflow-hidden">
          <div className="absolute inset-x-0 top-0">
            <div className="relative flex w-full justify-between">
              {/* Right decoration */}
              <img
                src={blueColorBrush}
                alt=""
                crossOrigin="anonymous"
                className="absolute top-0 right-0 z-0 h-36 w-28"
              />

              {/* Left decoration */}
              <img
                src={orangeColorBrushWithBrush}
                alt=""
                crossOrigin="anonymous"
                className="absolute top-0 left-0 z-0 h-36 w-32"
              />

              {/* Header content */}
              <div className="relative z-10 mt-10 flex w-full flex-col items-center">
                <div className="flex flex-col items-center">
                  <DesignTitle sizeVariant="FirstTitle" text="برآورد رنگ آمیزی" titleVariant="FristHeader" />

                  <div className="mt-3 flex w-40 justify-center">
                    <HorizontalFrame />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-2">
          {/* Customer info */}
          <div className="flex w-full items-center justify-between rounded-lg border border-design-gray-200 bg-design-white px-1.5 py-0.5 z-10">
            <div className="flex w-1/3 items-center">
              <div className="flex items-center justify-start gap-0.5">
                <UserIcon />

                <div className="flex items-center gap-1">
                  <DesignTitle color="BlackMain" sizeVariant="SmallBody" text="توسط:" titleVariant="Caption" />
                  <div className="shrink-0">
                    <DesignTitle
                      color="BlackMain"
                      sizeVariant="SmallBody"
                      text={data.customerName}
                      titleVariant="Caption"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-1/3 items-center justify-center border-l border-r border-design-gray-100">
              <DesignTitle color="BlackMain" sizeVariant="SmallBody" text="09123456789" titleVariant="Caption" />

              <PhoneIcon />
            </div>

            <div className="flex w-1/3 items-center justify-center gap-0.5">
              <DesignTitle color="BlackMain" sizeVariant="SmallBody" text="مشتری:" titleVariant="Caption" />
              <div className="shrink-0">
                <DesignTitle
                  color="BlackMain"
                  sizeVariant="SmallBody"
                  text={`${data.customerName}`}
                  titleVariant="Caption"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 flex items-center gap-2">
            {/* Final Cost */}
            <div className="h-40 w-full rounded-lg border border-design-gray-200 py-2">
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

            {/* Area */}
            <div className="h-40 w-full rounded-lg border border-design-gray-200 py-2">
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

            {/* Days */}
            <div className="h-40 w-full rounded-lg border border-design-gray-200 py-2">
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

            {/* Paint */}
            <div className="h-40 w-full rounded-lg border border-design-gray-200 py-2">
              <StatItem
                color="red"
                icon={
                  <div className="rounded-full bg-red-100 p-2">
                    <ColorPriceIcon />
                  </div>
                }
                value={totalPaintLiters}
                sub="(لیتر)"
                label="رنگ مورد نیاز"
              />
            </div>
          </div>

          {/* Materials */}
          <div className="relative mb-4 mt-7.5 rounded-lg border border-design-gray-200 pb-4 pt-9">
            <div className="border-b border-b-design-blue-2 px-6">
              <div className="absolute -top-5 left-0 right-0 m-auto flex w-40 items-center justify-between rounded-lg bg-blue-300 px-4 py-1">
                <ThreeLineIcon />

                <DesignTitle
                  sizeVariant="SmallSubtitle"
                  text="جزییات مصالح و لوازم"
                  titleVariant="Body"
                  color="Gray100"
                />

                <div className="rotate-180">
                  <ThreeLineIcon />
                </div>
              </div>

              <div className="flex items-center justify-between pb-2">
                <div className="w-1/2 text-right">
                  <DesignTitle sizeVariant="Subtitle" text="رنگ" titleVariant="Body" color="BlueMain" />
                </div>

                <div className="w-1/4 text-center">
                  <DesignTitle sizeVariant="Subtitle" text="لیتر" titleVariant="Body" color="BlueMain" />
                </div>

                <div className="w-1/4 text-left">
                  <DesignTitle sizeVariant="Subtitle" text="قیمت(تومان)" titleVariant="Body" color="BlueMain" />
                </div>
              </div>
            </div>

            <div className="px-6">
              <TableRow color="رنگ پلاستیک" price={data.paints.plastic.total_cost} liter={data.paints.plastic.liters} />

              <TableRow color="رنگ روغنی" price={data.paints.oil.total_cost} liter={data.paints.oil.liters} />

              <TableRow color="رنگ آکریلیک" price={data.paints.acrylic.total_cost} liter={data.paints.acrylic.liters} />

              <TableRow color="سایر ملزومات و ابزار" price={data.accessoriesCost} liter="-" />
            </div>

            <div className="mt-2 border-t border-design-blue-2 px-6">
              <TableRow color="جمع کل" price={data.totalMaterialCost} liter="-" bold />
            </div>
          </div>

          {/* Notes */}
          <div className="relative mt-8 pb-4">
            <div className="absolute -top-5 left-0 right-0 m-auto flex w-36 items-center justify-between rounded-lg bg-blue-300 p-1 px-2.5">
              <ThreeLineIcon />

              <DesignTitle sizeVariant="SmallSubtitle" text="سایر توضیحات" titleVariant="Body" color="Gray100" />

              <div className="rotate-180">
                <ThreeLineIcon />
              </div>
            </div>

            <div className="min-h-32 rounded-lg bg-[#FEF5ED] px-3 py-3">
              <img src={paintBucket} alt="" crossOrigin="anonymous" className="float-left -ml-2 -mt-4" />

              <DesignTitle sizeVariant="Body" text={data.notes ?? ""} titleVariant="Body" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          SHARE BUTTON
      ========================== */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 shadow-design-black-1 shadow-2xl rounded-t-3xl bg-white border border-white z-10 flex flex-col gap-3">
        <Button
          buttonVariant="SecondaryOutlineButton"
          contentVariant={{ value: "تکرار برآورد", TAG: "Text" }}
          heightVariant="MDButton"
          widthVariant="AutoWidthButton"
          extraClassName="w-full"
          onClick={() => copyProjectToDraftAction(projectId)}
          disabled={isSharing}
        />
        <Button
          buttonVariant="PrimarySolidButton"
          contentVariant={{ value: isSharing ? "در حال آماده‌سازی..." : "اشتراک گذاری", TAG: "Text" }}
          heightVariant="MDButton"
          widthVariant="AutoWidthButton"
          extraClassName="w-full"
          onClick={() => shareImage(shareRef.current)}
          disabled={isSharing}
        />
      </div>
    </div>
  );
}
