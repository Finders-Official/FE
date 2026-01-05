import type { ReactNode } from "react";

type IconSize = "sm" | "md" | "lg";

interface IconProps {
  children: ReactNode;
  size?: IconSize;
  className?: string;
}

const sizeMap: Record<IconSize, string> = {
  sm: "h-4 w-4 [&>svg]:h-3 [&>svg]:w-3", // 16px container, 12px icon
  md: "h-6 w-6 [&>svg]:h-4 [&>svg]:w-4", // 24px container, 16px icon
  lg: "h-8 w-8 [&>svg]:h-6 [&>svg]:w-6", // 32px container, 24px icon
};

export default function Icon({
  children,
  size = "md",
  className = "",
}: IconProps) {
  return (
    <span
      className={`inline-flex items-center justify-center ${sizeMap[size]} ${className}`}
    >
      {children}
    </span>
  );
}

export type { IconProps, IconSize };
