import { Button } from "@skul/sanjagh-design-system/src/Design_Button";
import React, { useState } from "react";

// 1. Types and Enums
export enum BidStepDirection {
  Increment = "BidIncrement",
  Decrement = "BidDecrement",
}

// Assuming Models.Toman maps to a structure like this.
// Adjust this interface to match your actual data model.
interface TomanPayload {
  type: "Toman";
  value: number;
}

export interface TomanCounterProps {
  initialCounterValue: string;
  onCounterChange: (payload: TomanPayload) => void;
  step: number;
  hasError: boolean;
}

// 2. Helper Functions
const removeSeparators = (value: string): string => value.replace(/,/g, "");

const formatWithCommas = (value: string): string => {
  if (!value) return "";
  // Equivalent to StringUtil.seperateCurrencyWithComma
  return Number(value).toLocaleString("en-US");
};

const convertPersianToEnglishDigits = (str: string): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  let result = str;
  persianDigits.forEach((pd, index) => {
    result = result.replace(new RegExp(pd, "g"), index.toString());
  });
  return result;
};

// 3. Component
export const TomanCounter: React.FC<TomanCounterProps> = ({ initialCounterValue, onCounterChange, step, hasError }) => {
  const [counterDisplayValue, setCounterDisplayValue] = useState<string>(initialCounterValue);

  const onCounterDisplayValueChange = (value: string) => {
    const trimmedValue = value.trim();
    const rawValue = removeSeparators(trimmedValue);

    // Convert Persian/Arabic digits to English
    const rawDigitsValue = convertPersianToEnglishDigits(rawValue);

    const floatCounterValue = parseFloat(rawDigitsValue) || 0.0;

    const isEmptyString = rawDigitsValue === "";
    const isNumeric = /^\d+$/.test(rawDigitsValue);
    const isWithinLimit = floatCounterValue <= 1000000000.0;
    const doesNotStartWithZero = !rawDigitsValue.startsWith("0");

    if ((isNumeric && isWithinLimit && doesNotStartWithZero) || isEmptyString) {
      setCounterDisplayValue(formatWithCommas(rawDigitsValue));
      onCounterChange({ type: "Toman", value: floatCounterValue });
    }
  };

  const onCounterDisplayChangeByStep = (dir: BidStepDirection) => {
    const floatValueOfCounterDisplay = parseFloat(removeSeparators(counterDisplayValue)) || 0.0;

    switch (dir) {
      case BidStepDirection.Increment: {
        const newValue = floatValueOfCounterDisplay + step;
        if (newValue < 1000000000.0) {
          onCounterDisplayValueChange(newValue.toString());
        }
        break;
      }
      case BidStepDirection.Decrement: {
        const newValue = floatValueOfCounterDisplay - step;
        if (newValue > 0.0) {
          onCounterDisplayValueChange(newValue.toString());
        }
        if (newValue === 0.0) {
          onCounterDisplayValueChange("");
        }
        break;
      }
    }
  };

  return (
    <div className="flex justify-center gap-x-3">
      {/* 
        Note: Assuming Button accepts standard React props. 
        If it requires specific variant types, you may need to import them.
      */}
      <Button
        onClick={() => onCounterDisplayChangeByStep(BidStepDirection.Increment)}
        widthVariant="FixedWidthButton"
        heightVariant="MDButton"
        buttonVariant="SecondaryGrayButton"
        contentVariant={{ TAG: "Text", value: "+" }}
        extraClassName="!text-black !text-[40px] font-normal !p-0 !w-10 shrink-0"
      />

      <div
        className={`flex gap-1 items-center p-1 border w-2/3 rounded-lg ${
          hasError ? "border-redDesign-main" : "border-grayDesign-100"
        }`}
      >
        <input
          dir="ltr"
          inputMode="numeric"
          className="placeholder:text-xs placeholder:text-blueDesign-main w-1/2 outline-none border-0"
          value={counterDisplayValue}
          placeholder="قیمت را بنویسید"
          onChange={e => onCounterDisplayValueChange(e.currentTarget.value)}
        />
        <span className="text-sm text-grayDesign-600">تومان</span>
      </div>

      <Button
        onClick={() => onCounterDisplayChangeByStep(BidStepDirection.Decrement)}
        widthVariant="FixedWidthButton"
        heightVariant="MDButton"
        buttonVariant="SecondaryGrayButton"
        contentVariant={{ TAG: "Text", value: "-" }}
        extraClassName="!text-black !text-[40px] font-normal !p-0 !w-10 shrink-0"
      />
    </div>
  );
};
