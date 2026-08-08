import { useId } from "react";

interface HorizontalFrameProps {
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
}

const HorizontalFrame = ({ width = 184, height = 6, color = "#00133C", className }: HorizontalFrameProps) => {
  const id = useId();

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 184 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
    >
      {/* Left Line */}
      <path d="M86 3H0" stroke={`url(#left-${id})`} strokeOpacity={0.84} />

      {/* Diamond */}
      <rect x="92" width="4.24211" height="4.24211" transform="rotate(45 92 0)" fill="currentColor" />

      {/* Right Line */}
      <path d="M98 3H184" stroke={`url(#right-${id})`} strokeOpacity={0.84} />

      <defs>
        <linearGradient id={`left-${id}`} x1="86" y1="3" x2="0" y2="3" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor" />
          <stop offset="1" stopColor="white" />
        </linearGradient>

        <linearGradient id={`right-${id}`} x1="98" y1="3" x2="184" y2="3" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default HorizontalFrame;
