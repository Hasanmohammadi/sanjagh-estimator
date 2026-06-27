import { Button } from "@skul/sanjagh-design-system/src/Design_Button";
import React, { useEffect, useState } from "react";

export enum BidStepDirection {
  Increment = "BidIncrement",
  Decrement = "BidDecrement",
}

interface TomanPayload {
  type: "Toman";
  value: number;
}

export interface TomanCounterProps {
  initialCounterValue: string;
  onCounterChange: (payload: TomanPayload) => void;
  step: number;
  hasError: boolean;
  className?: string;
  min?: number;
  max?: number;
}

const removeSeparators = (value: string): string => value.replace(/,/g, "");

const formatWithCommas = (value: string): string => {
  if (!value) return "";

  const parts = value.split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1];

  let formattedInteger = "";
  if (integerPart) {
    formattedInteger = Number(integerPart).toLocaleString("en-US");
  }

  if (decimalPart !== undefined) {
    return `${formattedInteger}.${decimalPart}`;
  }
  return formattedInteger;
};

const convertPersianToEnglishDigits = (str: string): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  let result = str;
  persianDigits.forEach((pd, index) => {
    result = result.replace(new RegExp(pd, "g"), index.toString());
  });
  return result;
};

const roundToStepPrecision = (value: number, step: number): number => {
  const decimalPlaces = (step.toString().split(".")[1] || "").length;
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.round(value * multiplier) / multiplier;
};

const isValidDecimal = (value: string): boolean => {
  return /^\d*\.?\d*$/.test(value) && (value.match(/\./g) || []).length <= 1;
};

export const TomanCounter: React.FC<TomanCounterProps> = ({
  initialCounterValue,
  onCounterChange,
  step,
  hasError,
  className,
  min = 0,
  max = 1000000000,
}) => {
  const [counterDisplayValue, setCounterDisplayValue] = useState<string>(initialCounterValue);

  const currentValue = parseFloat(removeSeparators(counterDisplayValue)) || 0;
  const isAtMin = currentValue <= min;
  const isAtMax = currentValue >= max;

  const onCounterDisplayValueChange = (value: string) => {
    const trimmedValue = value.trim();
    const rawValue = removeSeparators(trimmedValue);
    const rawDigitsValue = convertPersianToEnglishDigits(rawValue);

    const isEmptyString = rawDigitsValue === "";
    const isNumeric = isValidDecimal(rawDigitsValue);
    const floatCounterValue = parseFloat(rawDigitsValue) || 0.0;
    const isWithinLimit = floatCounterValue >= min && floatCounterValue <= max;
    const doesNotStartWithZeroUnlessDecimal = !/^0\d/.test(rawDigitsValue.replace(".", ""));

    if ((isNumeric && isWithinLimit && doesNotStartWithZeroUnlessDecimal) || isEmptyString) {
      setCounterDisplayValue(formatWithCommas(rawDigitsValue));
      onCounterChange({ type: "Toman", value: floatCounterValue });
    }
  };

  useEffect(() => {
    setCounterDisplayValue(initialCounterValue);
  }, [initialCounterValue]);

  const onCounterDisplayChangeByStep = (dir: BidStepDirection) => {
    const floatValueOfCounterDisplay = parseFloat(removeSeparators(counterDisplayValue)) || 0.0;

    switch (dir) {
      case BidStepDirection.Increment: {
        const newValue = roundToStepPrecision(floatValueOfCounterDisplay + step, step);
        if (newValue <= max) {
          onCounterDisplayValueChange(newValue.toString());
        }
        break;
      }
      case BidStepDirection.Decrement: {
        const newValue = roundToStepPrecision(floatValueOfCounterDisplay - step, step);
        if (newValue <= min) {
          onCounterDisplayValueChange(min > 0 ? min.toString() : "");
        } else {
          onCounterDisplayValueChange(newValue.toString());
        }
        break;
      }
    }
  };

  const buttonBaseClassName =
    "!text-black !text-[20px] font-normal !p-0 !w-10 shrink-0 border-0 !bg-transparent hover:!bg-gray-100 !rounded-none";

  return (
    <div
      className={`${className} flex items-center border rounded-md overflow-hidden ${
        hasError ? "border-redDesign-main" : "border-grayDesign-300"
      }`}
    >
      <Button
        onClick={() => onCounterDisplayChangeByStep(BidStepDirection.Decrement)}
        widthVariant="FixedWidthButton"
        heightVariant="MDButton"
        buttonVariant="SecondaryGrayButton"
        contentVariant={{ TAG: "Text", value: "-" }}
        disabled={isAtMin}
        extraClassName={`${buttonBaseClassName} ${isAtMin ? "!opacity-30 !cursor-not-allowed hover:!bg-transparent" : ""}`}
      />

      <input
        dir="ltr"
        inputMode="decimal"
        className="flex-1 w-full min-w-0 text-center outline-none border-x border-design-gray-200 placeholder:text-xs placeholder:text-design-blue-1"
        value={counterDisplayValue}
        placeholder="0"
        onChange={e => onCounterDisplayValueChange(e.currentTarget.value)}
      />

      <Button
        onClick={() => onCounterDisplayChangeByStep(BidStepDirection.Increment)}
        widthVariant="FixedWidthButton"
        heightVariant="MDButton"
        buttonVariant="SecondaryGrayButton"
        contentVariant={{ TAG: "Text", value: "+" }}
        disabled={isAtMax}
        extraClassName={`${buttonBaseClassName} ${isAtMax ? "!opacity-30 !cursor-not-allowed hover:!bg-transparent" : ""}`}
      />
    </div>
  );
};

export const TomanCounterGroup = () => {
  return (
    <div className="flex justify-center gap-x-4 p-4">
      <TomanCounter initialCounterValue="" onCounterChange={() => {}} step={0.2} hasError={false} min={0} max={100} />
      <TomanCounter initialCounterValue="1.3" onCounterChange={() => {}} step={1.3} hasError={false} min={0} max={50} />
      <TomanCounter initialCounterValue="1" onCounterChange={() => {}} step={1} hasError={false} min={0} max={1000} />
    </div>
  );
};
