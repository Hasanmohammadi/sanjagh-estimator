import type { ReactElement } from "react";
import { ColorPriceIcon, PriceSettingIcon } from "@/assets/icons";

export type PricingItem = {
  /** unique key used as the form field name prefix */
  key: string;
  /** the item label, e.g. "قیمت رنگ پلاستیک بدون مصالح" */
  label: string;
};

/**
 * "range"  -> two inputs per item (min + max)
 * "single" -> one input per item (price)
 */
export type SectionVariant = "range" | "single";

export type PricingSection = {
  key: string;
  /** section heading, e.g. "اجرت خدمات" */
  title: string;
  variant: SectionVariant;
  /** label above the "min" input (range variant) */
  minLabel: string;
  /** label above the "max" input (range variant) */
  maxLabel: string;
  /** label above the single input (single variant) */
  priceLabel: string;
  items: PricingItem[];
  icon: ReactElement;
};

/** The structure shown in the reference design. */
export const pricingSections: PricingSection[] = [
  {
    key: "services",
    title: "اجرت خدمات",
    variant: "range",
    minLabel: "حداقل قیمت هر متر مربع",
    maxLabel: "حداکثر قیمت هر متر مربع",
    priceLabel: "قیمت هر متر مربع",
    icon: <PriceSettingIcon />,
    items: [
      { key: "plasticService", label: "قیمت رنگ پلاستیک بدون مصالح" },
      { key: "oilService", label: "قیمت رنگ روغن بدون مصالح" },
      { key: "acrylicService", label: "قیمت رنگ آکریلیک بدون مصالح" },
    ],
  },
  {
    key: "materials",
    title: "قیمت رنگ مصرفی",
    variant: "single",
    minLabel: "حداقل قیمت هر متر مربع",
    maxLabel: "حداکثر قیمت هر متر مربع",
    priceLabel: "قیمت هر لیتر",
    icon: <ColorPriceIcon />,
    items: [
      { key: "plasticLiter", label: "قیمت هر لیتر رنگ پلاستیک" },
      { key: "oilLiter", label: "قیمت هر لیتر رنگ روغن" },
      { key: "acrylicLiter", label: "قیمت هر لیتر رنگ آکریلیک" },
    ],
  },
];
