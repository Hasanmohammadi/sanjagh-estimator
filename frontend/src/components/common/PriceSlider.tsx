import * as React from "react";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { ChevronLeftIcon, ChevronRightIcon } from "@/assets/icons";

export interface PriceSliderProps {
  /** Heading shown in the top-right corner */
  title?: string;
  /** Helper text shown under the value */
  description?: string;
  /** Unit label rendered next to the value (e.g. "میلیون تومان") */
  unit?: string;
  /** Label for the low end of the range */
  minLabel?: string;
  /** Label for the high end of the range */
  maxLabel?: string;
  /** Minimum selectable value */
  min?: number;
  /** Maximum selectable value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Controlled value */
  value?: number;
  /** Initial value when uncontrolled */
  defaultValue?: number;
  /** Fired whenever the value changes */
  onValueChange?: (value: number) => void;
  /** Render Persian (Eastern Arabic) digits. Defaults to true. */
  persianDigits?: boolean;
  className?: string;
}

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, d => PERSIAN_DIGITS[Number(d)]);
}

export function PriceSlider({
  title = "قیمت نهایی",
  description = "تنظیم قیمت در بازه من",
  unit = "میلیون تومان",
  minLabel = "کمترین",
  maxLabel = "بیشترین",
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = 12,
  onValueChange,
  persianDigits = true,
  className,
}: PriceSliderProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const current = isControlled ? (value as number) : internal;

  const trackRef = React.useRef<HTMLDivElement>(null);
  const handleRef = React.useRef<HTMLButtonElement>(null);
  const draggingRef = React.useRef(false);

  const percent = ((current - min) / (max - min)) * 100;

  const commit = React.useCallback(
    (next: number) => {
      const clamped = Math.min(max, Math.max(min, next));
      const snapped = Math.round((clamped - min) / step) * step + min;
      const final = Math.min(max, Math.max(min, snapped));
      if (!isControlled) setInternal(final);
      onValueChange?.(final);
    },
    [isControlled, max, min, onValueChange, step],
  );

  const valueFromClientX = React.useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return current;
      const rect = track.getBoundingClientRect();
      const ratio = (clientX - rect.left) / rect.width;
      const clampedRatio = Math.min(1, Math.max(0, ratio));
      return min + clampedRatio * (max - min);
    },
    [current, max, min],
  );

  React.useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!draggingRef.current) return;
      commit(valueFromClientX(e.clientX));
    }
    function onUp() {
      if (!draggingRef.current) return;
      draggingRef.current = false;
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [commit, valueFromClientX]);

  function startDrag(clientX: number, pointerId: number, target: Element) {
    draggingRef.current = true;
    commit(valueFromClientX(clientX));

    try {
      (target as Element & { setPointerCapture?: (id: number) => void }).setPointerCapture?.(pointerId);
    } catch {
      // no-op: setPointerCapture can throw in some edge cases (e.g. detached nodes)
    }
  }

  function handleTrackPointerDown(e: React.PointerEvent) {
    startDrag(e.clientX, e.pointerId, e.currentTarget);
  }

  function handleHandlePointerDown(e: React.PointerEvent) {
    e.stopPropagation();
    startDrag(e.clientX, e.pointerId, e.currentTarget);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        commit(current + step);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        commit(current - step);
        break;
      case "Home":
        e.preventDefault();
        commit(min);
        break;
      case "End":
        e.preventDefault();
        commit(max);
        break;
    }
  }

  const displayValue = persianDigits ? toPersianDigits(current) : String(current);

  return (
    <div dir="rtl" className={className}>
      <DesignTitle sizeVariant="ThirdTitle" text={title} titleVariant="Body" color="BlackMain" />

      <div className="mt-0 flex items-baseline justify-end gap-2">
        <span className="text-4xl font-bold">{displayValue}</span>
        <DesignTitle sizeVariant="ThirdTitle" text={unit} titleVariant="ThirdHeader" color="BlackMain" />
      </div>

      {description ? (
        <div className="flex justify-end mt-2.5">
          <DesignTitle sizeVariant="Body" text={description} titleVariant="Body" color="Gray500" />
        </div>
      ) : null}

      <div className="mt-2.5">
        <div
          ref={trackRef}
          onPointerDown={handleTrackPointerDown}
          className="relative flex h-8 cursor-pointer items-center touch-none select-none"
        >
          <div className="h-0.5 w-full rounded-full bg-border bg-design-black-1" />

          <div className="absolute h-0.5 rounded-full bg-primary" style={{ left: 0, width: `${percent}%` }} />

          <button
            ref={handleRef}
            type="button"
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={current}
            aria-label={title}
            tabIndex={0}
            onPointerDown={handleHandlePointerDown}
            onKeyDown={handleKeyDown}
            style={{ left: value === max ? `calc(${percent}% - 50px)` : `calc(${percent}% - 12px)` }}
            className="absolute flex h-7.5 bg-design-white w-14 items-center justify-evenly rounded-full border border-design-gray-400 outline-none transition-shadow hover:shadow focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronRightIcon />
            <ChevronLeftIcon />
          </button>
        </div>

        <div dir="ltr" className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <DesignTitle sizeVariant="Body" text={minLabel} titleVariant="Body" color="Gray600" />
          <DesignTitle sizeVariant="Body" text={maxLabel} titleVariant="Body" color="Gray600" />
        </div>
      </div>
    </div>
  );
}
