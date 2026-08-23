import { useId, useState } from "react";

type SwitchSize = "sm" | "md" | "lg";

type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: SwitchSize;
};

const sizeClasses = {
  sm: {
    track: "h-8 w-12",
    thumb: "size-4 right-2 top-2",
    translate: "peer-checked:[&>span]:-translate-x-4",
  },
  md: {
    track: "h-10 w-16",
    thumb: "size-6 right-2 top-2",
    translate: "peer-checked:[&>span]:-translate-x-6",
  },
  lg: {
    track: "h-12 w-20",
    thumb: "size-8 right-2 top-2",
    translate: "peer-checked:[&>span]:-translate-x-8",
  },
};

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  label = "Toggle setting",
  size = "md",
}: SwitchProps) {
  const id = useId();

  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const sizes = sizeClasses[size];

  function handleChange(nextChecked: boolean) {
    if (!isControlled) {
      setInternalChecked(nextChecked);
    }

    onCheckedChange?.(nextChecked);
  }

  return (
    <label
      htmlFor={id}
      dir="rtl"
      className={`inline-flex ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={isChecked}
        onChange={event => handleChange(event.target.checked)}
        disabled={disabled}
        aria-label={label}
        className="peer sr-only"
      />

      <span
        aria-hidden="true"
        className={`
          relative block rounded-full
          ${sizes.track}
          bg-design-gray-200
          transition-colors duration-200
          peer-focus-visible:outline-2
          peer-focus-visible:outline-offset-4
          peer-focus-visible:outline-ring
          peer-checked:bg-design-black-1
          ${sizes.translate}
        `}
      >
        <span
          className={`
            absolute block rounded-full
            ${sizes.thumb}
            bg-design-gray-50
            shadow-sm
            transition-transform duration-200 ease-out
          `}
        />
      </span>
    </label>
  );
}
